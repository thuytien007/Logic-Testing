//detail ViewModel
function PODetailViewModel() {
    //get Id from PO List screen
    var Id = parseInt($('#OrderId').val());
    var self = this;
    var checkAdd = false;


    //function to format date not included time for detail screen
    self.FormatDate = function (date) {
        var oldDate = new Date(parseInt(date.replace(/(^.*\()|([+-].*$)/g, '')));
        var newDate = ("0" + oldDate.getDate()).slice(-2) + "/" +
            ("0" + (oldDate.getMonth() + 1)).slice(-2) + "/" + oldDate.getFullYear();
        return newDate;
    }

    //Init PO Head Model Object
    self.POHeadModel = function (OrderNo, SupplierCode, SupplierName, StockSiteCode, StockSiteName, OrderDate, Country, Note, Address, PostCode, Cancel) {
        var _this = this;
        _this.OrderNo = ko.observable(OrderNo);
        _this.SupplierCode = ko.observable(SupplierCode);
        _this.SupplierName = ko.observable(SupplierName);
        _this.StockSiteCode = ko.observable(StockSiteCode);
        _this.StockSiteName = ko.observable(StockSiteName);
        _this.OrderDate = ko.observable(OrderDate);
        _this.Country = ko.observable(Country).extend({ required: true, maxLength: 50 });
        _this.Note = ko.observable(Note);
        _this.Address = ko.observable(Address).extend({ required: true, maxLength: 50 });
        _this.PostCode = ko.observable(PostCode).extend({ required: true, maxLength: 50 });
        _this.Cancel = ko.observable(Cancel);
        return _this;
    };

    //this function set data got from db to ko.observerble-->serve for validate if it have any changes
    self.PoHeadObjectSetObservable = function (obj) {
        try {
            var poHead = new self.POHeadModel(obj.OrderNo, obj.SupplierCode, obj.SupplierName, obj.StockSiteCode, obj.StockSiteName, obj.OrderDate, obj.Country, obj.Note, obj.Address, obj.PostCode, obj.Cancel);
            return poHead;
        } catch (err) {
            console.log(err.message);
        }
    };

    var objectTemp = null;
    //get data to show on PO Head
    self.getResultPOHeadObject = function () {
        var orderDate;
        $.ajax({
            url: '/Home/GetPOHeadObject',
            contentType: 'application/json',
            data: { id: Id },
            type: "GET",
            async: false,
            success: function (data) {
                objectTemp = data;
                console.log("success");
            },
            error: function () {
                alert("Not Found");
            }
        });
        orderDate = self.FormatDate(objectTemp.OrderDate);
        objectTemp.OrderDate = orderDate;
        return objectTemp;
    };

    var objResult = self.getResultPOHeadObject();
    //Init temp PO Head Object to get data from db
    self.poHeadObject = ko.observable(self.PoHeadObjectSetObservable(objResult));

    //Init PO Line List
    self.POLineModel = function (PartNo, OrderNo, PartCode, PartDescription, ManufactureName, Amount, Price, Memo) {
        var _this = this;
        _this.PartNo = ko.observable(PartNo);
        _this.OrderNo = ko.observable(OrderNo);
        _this.PartCode = ko.observable(PartCode);
        _this.PartDescription = ko.observable(PartDescription);
        _this.ManufactureName = ko.observable(ManufactureName);
        _this.Amount = ko.observable(Amount).extend({ required: true, min: 1 });
        _this.Price = ko.observable(Price).extend({ required: true, min: 1 });
        _this.Memo = ko.observable(Memo).extend({ maxLength: 50 });
        //sum Qty with Price and make round to 2
        _this.TotalPrice = ko.computed(function () {
            return Number(_this.Amount() * _this.Price()).toFixed(2);
        });
        return _this;
    };

    //this function to set new array object with ko observable POLineModel, so the TotalPrice is auto valuable
    self.InitPOLineModelList = function (oriArray) {
        try {
            this.tempList = [];
            oriArray.forEach(function (item) {
                var poLine = new self.POLineModel(item.PartNo, item.OrderNo, item.Partcode, item.PartDescription, item.ManufactureName, item.Amount, item.Price, item.Memo);
                this.tempList.push(poLine);
            }, this);

            return this.tempList;
        } catch (err) {
            console.log(err.message);
        }
    };

    //get PO Line List
    self.GetPOLineList = function () {
        $.ajax({
            url: '/Home/GetPOLineList',
            contentType: 'application/json',
            data: { id: Id },
            type: "GET",
            async: true,
            success: function (data) {
                //listPOLineTemp = data;
                console.log("get data from PO Line success");
                self.GetPOLineSuccessCallBack(data);
            },
            error: function () {
                console.log("error with get data");
            }
        });
    }();

    //this function to set list got from db to POLineList & sum price
    self.GetPOLineSuccessCallBack = function (data)
    {
        self.POLineList(self.InitPOLineModelList(data));
        self.SumTotalPrice();
    }

    self.POLineList = ko.observableArray();

    //sum TotalPrice of PO Line list, this used computed because when totalprice change ==> SumTotalPrice auto change too
    self.SumTotalPrice = ko.computed(function () {
        try {
            var sumTotalPrice = 0;
            self.POLineList().forEach(function (item) {
                //must be parse to int because when we update it from view, it's a string
                sumTotalPrice += parseFloat(item.TotalPrice());
            })
            return Number((sumTotalPrice).toFixed(2));
        } catch (err) {
            console.log(err.message);
        }
    });

    //check error of PO Line list
    self.checkValidatePOLine = function (poLineList) {
        var error = false;
        for (var i = 0; i < poLineList.length; i++) {
            var amount = parseInt(poLineList[i].Amount());
            var buyPrice = parseFloat(poLineList[i].Price());
            if (amount <= 0 || buyPrice <= 0 || isNaN(amount) || isNaN(buyPrice)) {
                error = true;
                break;
            }
        }
        return error;
    }
    //update PO Detail
    self.UpdatePODetail = function () {
        var errorPOHead = ko.validation.group(self.poHeadObject());
        //validate PO Line before submit
        var rsCheckPOLineError = self.checkValidatePOLine(self.POLineList());

        if (errorPOHead().length === 0 && rsCheckPOLineError == false) {
            $.ajax({
                url: '/Home/UpdatePODetails',
                contentType: 'application/json',
                //this is passing with multiple object
                data: ko.toJSON({ poHead: self.poHeadObject, poLine: self.POLineList }),
                //this is passing with 1 object
                //data: ko.toJSON(self.poHeadObject),
                type: "POST",
                dataType: 'json',
                async: true,
                success: self.UpdatePODetailSuccessCallback,
                error: self.errorCallback
            });
        } else {
            alert('Please check your submission');
            $('div.alert-danger').show();
        }
    }

    //cancel PO
    self.cancelPO = function () {
        $.ajax({
            url: '/Home/UpdateCancelPO',
            contentType: 'application/json',
            data: ko.toJSON({ poHead: self.poHeadObject, poLine: self.POLineList }),
            type: "POST",
            async: false,
            success: function () {
                window.location.href = '/Home/Details/' + Id;
            },
            error: self.errorCallback
        });
    }

    //check if is Cancel then bind to the link
    self.checkIfPOCancel = function () {
        if (self.poHeadObject().Cancel() == true) {
            //if PO is cancelled then return false, it means do nothing when link clicked
            return false;
        } else {
            return true;
        }
    }

    // this function to reload page after update all PO Head & PO Line
    self.UpdatePODetailSuccessCallback = function () {
        alert("updated success");
        window.location.href = '/Home/Details/' + Id;
    }
    //this is a general function when error occur
    self.errorCallback = function () {
        alert("update failed");
    }

    //get list po line included Parts except existed po line list
    self.poLineListExceptedExistedPOLineList = ko.observableArray();
    self.addPOLine = function () {
        $.ajax({
            url: '/Home/GetPOLineExceptExistedPOLList',
            contentType: 'application/json',
            data: { id: Id },
            type: "GET",
            async: true,
            success: function (data) {
                self.POLineList.push(new self.POLineModel(0, 0, "", "", "", 0, 0, ""));
                checkAdd = true;
                self.poLineListExceptedExistedPOLineList(data);
                console.log("get data from PO Line success");
            },
            error: function () {
                console.log("error with get data for new PO Line");
            }
        });
    }

    //Init a row when user click a row on PO Line
    self.SelectedRow = {};
    self.getIndexObject = function (row) {
        //set selected row as an object of row object
        self.SelectedRow = row;
    }

    //init object to get selected object that user choose
    self.idSelected = ko.observable(new self.POLineModel());

    self.idSelected.subscribe((selected) => {
        if (self.idSelected() !== undefined) {
            //self.POLineList()[index].PartNo(self.idSelected().PartNo);
            //self.POLineList()[index].OrderNo(0);
            //self.POLineList()[index].PartDescription(selected.PartDescription);
            //self.POLineList()[index].ManufactureName(selected.ManufactureName);
            //self.POLineList()[index].Amount(selected.Amount);
            //self.POLineList()[index].Price(selected.Price);
            //self.POLineList()[index].Memo(selected.Memo);           
            self.SelectedRow.PartNo(selected.PartNo);
            self.SelectedRow.OrderNo(0);
            self.SelectedRow.PartCode(selected.Partcode);
            self.SelectedRow.PartDescription(selected.PartDescription);
            self.SelectedRow.ManufactureName(selected.ManufactureName);
            self.SelectedRow.Amount(selected.Amount);
            self.SelectedRow.Price(selected.Price);
            self.SelectedRow.Memo(selected.Memo);
        }
    });

    //remove line after add button clicked(maybe an empty line or not but didn't save yet)
    self.removePOLine = function (item) {
        self.POLineList.remove(item);
    }

    //delete a poline
    self.deletePOLine = function (data) {
        //when user add a new empty po line
        if (data.OrderNo() == 0) {
            self.removePOLine(data);
        } else {
            var countRow = self.POLineList().length;
            if (countRow > 1 && checkAdd == false) {
                if (confirm("Are you sure about delete this PO Line?")) {
                    //confirm is a function of js. if user click yes then lead to ajax
                    $.ajax({
                        url: '/Home/DeletePerson',
                        contentType: 'application/json',
                        data: ko.toJSON(data),
                        type: "POST",
                        async: true,
                        success: function () {
                            window.location.href = '/Home/Details/' + Id;
                        },
                        error: self.errorCallback
                    });
                }
            } else {
                alert("Warning: The PO must have at least one PO line");
            }
        }
    }
}


$(function () {
    ko.validation.init({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        //style css for error tag
        errorClass: 'errorStyle',
        //using grouping with deep because we have arrayobject, need to get object inside array
        //deep helps us access into that object
        //grouping: { deep: true, observable: true },
        messageTemplate: null
    }, true);

    ////Ex: handle for specific validate that rule is not support
    //ko.validation.rules['requiredFirstName'] = {
    //    validator: function (val) {
    //        return val.length >= 5 && val.length <= 10 && val.charAt(0) == "M";
    //    },
    //    message: 'first name must larger than 5, lower than 10 and start with M'
    //};

    ko.validation.registerExtenders();

    //applyBindings for specific screen to avoid error multiple apply
    ko.applyBindings(new PODetailViewModel(), document.getElementById('details'));
})