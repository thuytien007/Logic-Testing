//function to format date
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
        self.SupplierCode = ko.observable(SupplierCode);
        self.SupplierName = ko.observable(SupplierName);
        self.StockSiteCode = ko.observable(StockSiteCode);
        self.StockSiteName = ko.observable(StockSiteName);
        self.OrderDate = ko.observable(OrderDate);
        self.Country = ko.observable(Country);
        self.Note = ko.observable(Note);
        self.Address = ko.observable(Address);
        self.PostCode = ko.observable(PostCode);
    };

    //Init PO Line List
    self.POLineModelInit = function (PartCode, PartDescription, ManufactureName, Amount, BuyPrice, Memo) {
        var self = this;
        self.PartCode = ko.observable(PartCode);
        self.PartDescription = ko.observable(PartDescription);
        self.ManufactureName = ko.observable(ManufactureName);
        self.Amount = ko.observable(Amount);
        self.BuyPrice = ko.observable(BuyPrice);
        self.Memo = ko.observable(Memo);
        self.TotalPrice = ko.computed(function () {
            return self.Amount() * self.BuyPrice();
        });
        return this;
    };

    //this function to set new array object with ko observable POLineModelInit, so the TotalPrice is auto valuable
    self.poLineListWithTotalPrice = function (oriArray) {
        try {
            this.tempList = [];
            oriArray.forEach(function (item) {
                var poLine = new self.POLineModelInit(item.Partcode, item.PartDescription, item.ManufacturName, item.Amount, item.BuyPrice, item.Memo);
                this.tempList.push(poLine);
            }, this);

            return this.tempList;
        } catch (err) {
            console.log(err.message);
        }
    };

    var objectTemp = null;    
    //get data to show on PO Head
    self.getResultPOHeadObject = function () {
        //debugger
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
    var ojTemp = self.getResultPOHeadObject();
    //Init temp PO list to get data from controller
    self.poHeadObject = ko.observable(ojTemp);

    //get PO Line List
    var listPOLineTemp = [];
    self.getPOLineList = function () {
        //debugger
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
        debugger
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

    self.sumTotalPrice = ko.observable(self.sumTotalPriceOfPOLineList(self.POLineList()));

    //Init row of PO Line
    self.poLineRow = ko.observable(new self.POLineModelInit("", "", "", 0, 0, "", 0));
}




$(function () {
    ko.validation.init({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        //using grouping with deep because we have arrayobject, need to get object inside array
        //deep helps us access into that object
        grouping: { deep: true, observable: true },
        messageTemplate: null
    }, true);

    ko.validation.rules['requiredFirstName'] = {
        validator: function (val) {
            return val.length >= 5 && val.length <= 10 && val.charAt(0) == "M";
        },
        message: 'first name must larger than 5, lower than 10 and start with M'
    };
    ko.validation.registerExtenders();

    ko.applyBindings(new PODetailViewModel(), document.getElementById('details'));
   
})