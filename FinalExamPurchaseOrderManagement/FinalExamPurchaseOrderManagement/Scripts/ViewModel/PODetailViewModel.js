﻿//function to format date
var formatDate = function (date) {
    var oldDate = new Date(parseInt(date.replace(/(^.*\()|([+-].*$)/g, '')));
    var newDate = oldDate.getDate() + "/" + (oldDate.getMonth() + 1) + "/" + oldDate.getFullYear();
    return newDate;
}

//main ViewModel
function PODetailViewModel() {
    //get Id from PO List screen
    var Id = parseInt($('#OrderId').val());
    var self = this;

    //Init PO Head Model Object
    self.PODetailModelInit = function (SupplierCode, SupplierName, StockSiteCode, StockSiteName, OrderDate, Country, Note, Address, PostCode) {
        var _this = this;
        _this.SupplierCode = ko.observable(SupplierCode);
        _this.SupplierName = ko.observable(SupplierName);
        _this.StockSiteCode = ko.observable(StockSiteCode);
        _this.StockSiteName = ko.observable(StockSiteName);
        _this.OrderDate = ko.observable(OrderDate);
        _this.Country = ko.observable(Country).extend({ required: true, maxLength: 50});
        _this.Note = ko.observable(Note);
        _this.Address = ko.observable(Address).extend({ required: true, maxLength: 50 });
        _this.PostCode = ko.observable(PostCode).extend({ required: true, maxLength: 50 });
        return _this;
    };

    //this function set data got from db to ko.observerble-->serve for validate if it have any changes
    self.poHeadObjectSetObserverble = function (obj) {
        try {
            var poHead = new self.PODetailModelInit(obj.SupplierCode, obj.SupplierName, obj.StockSiteCode, obj.StockSiteName, obj.OrderDate, obj.Country, obj.Note, obj.Address, obj.PostCode);
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
        orderDate = formatDate(objectTemp.OrderDate);
        objectTemp.OrderDate = orderDate;
        return objectTemp;
    }
    var objResult = self.getResultPOHeadObject();
    //Init temp PO Head Object to get data from db
    self.poHeadObject = ko.observable(self.poHeadObjectSetObserverble(objResult));

    //Init PO Line List
    self.POLineModelInit = function (PartNo, OrderNo, PartCode, PartDescription, ManufactureName, Amount, BuyPrice, Memo) {
        var _this = this;
        _this.PartNo = ko.observable(PartNo);
        _this.OrderNo = ko.observable(OrderNo);
        _this.PartCode = ko.observable(PartCode);
        _this.PartDescription = ko.observable(PartDescription);
        _this.ManufactureName = ko.observable(ManufactureName);
        _this.Amount = ko.observable(Amount).extend({ required: true, min: 1 }).extend({ digit: true });
        _this.BuyPrice = ko.observable(BuyPrice).extend({ required: true, min: 1 }).extend({ digit: true });
        _this.Memo = ko.observable(Memo);
        _this.TotalPrice = ko.computed(function () {
            return _this.Amount() * _this.BuyPrice();
        });
        return _this;
    };

    //this function to set new array object with ko observable POLineModelInit, so the TotalPrice is auto valuable
    self.poLineListWithTotalPrice = function (oriArray) {
        try {
            this.tempList = [];
            oriArray.forEach(function (item) {
                var poLine = new self.POLineModelInit(item.PartNo, item.OrderNo, item.Partcode, item.PartDescription, item.ManufactureName, item.Amount, item.BuyPrice, item.Memo);
                this.tempList.push(poLine);
            }, this);

            return this.tempList;
        } catch (err) {
            console.log(err.message);
        }
    };

    //get PO Line List
    var listPOLineTemp = [];
    self.getPOLineList = function () {
        $.ajax({
            url: '/Home/GetPOLineList',
            contentType: 'application/json',
            data: { id: Id },
            type: "GET",
            async: false,
            success: function (data) {
                listPOLineTemp = data;
                console.log("get data from PO Line success");
            },
            error: function () {
                console.log("error with get data");
            }
        });
        return listPOLineTemp;
    }

    listPOLineTemp = self.getPOLineList();
    self.POLineList = ko.observableArray(self.poLineListWithTotalPrice(listPOLineTemp));

    //sum all TotalPrice according to binding PO Line list
    self.sumTotalPriceOfPOLineList = function (arrObject) {
        try {
            var sumTotalPrice = 0;
            arrObject.forEach(function (item) {
                //must be parse to int because when we update it from view, it's a string
                sumTotalPrice += parseFloat(item.TotalPrice());
            })
            return sumTotalPrice;
        } catch (err) {
            console.log(err.message);
        }
    }

    //sum TotalPrice of PO Line list, this used computed because when totalprice change ==> sumTotalPrice auto change too
    self.sumTotalPrice = ko.computed(function () {
        return self.sumTotalPriceOfPOLineList(self.POLineList());
    });

    //Init row of PO Line
    self.poLineRow = ko.observable(new self.POLineModelInit("", "", "", 0, 0, "", 0));
    //check error of PO Line list
    self.checkValidatePOLine = function (poLineList) {
        var error = false;
        for (var i = 0; i < poLineList.length; i++)
        {
            var amount = parseInt(poLineList[i].Amount());
            var buyPrice = parseFloat(poLineList[i].BuyPrice());
            if (amount <= 0 || buyPrice <= 0 || isNaN(amount) || isNaN(buyPrice)) {
                error = true;
                break;
            }
        }
        return error;
    }
    //update PO Detail
    self.updatePODetail = function () {
        debugger
        var errorPOHead = ko.validation.group(self.poHeadObject());
        //validate PO Line before submit
        var rsCheckPOLineError = self.checkValidatePOLine(self.POLineList());
       
        if (errorPOHead().length === 0 && rsCheckPOLineError == false) {
            $('div.alert-success').show();
            $.ajax({
                url: '/Home/UpdatePODetails',
                contentType: 'application/json',
                //this is passing with multiple object
                data: ko.toJSON({ poHead: self.poHeadObject, poLine: self.POLineList }),
                //this is passing with 1 object
                //data: ko.toJSON(self.poHeadObject),
                type: "POST",
                dataType: 'json',
                async: false,
                success: self.successCallback,
                error: self.errorCallback
            });
        } else {
            alert('Please check your submission');
            $('div.alert-danger').show();
        }
    }

    self.successCallback = function () {
        alert("update success");
    }
    self.errorCallback = function () {
        alert("update failed");
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