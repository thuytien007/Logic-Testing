
//main ViewModel
function PODetailViewModel() {
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
    self.POLineModelInit = function (PartCode, PartDescription, Manufacture, QtyOrder, BuyPrice, Memo) {
        self.PartCode = ko.observable(PartCode);
        self.PartDescription = ko.observable(PartDescription);
        self.Manufacture = ko.observable(Manufacture);
        self.QtyOrder = ko.observable(QtyOrder);
        self.BuyPrice = ko.observable(BuyPrice);
        self.Memo = ko.observable(Memo);
    };

    var objectTemp = null;    
    //get data to show on PO Head
    self.getResultPOHeadObject = function () {
        //debugger
        var orderDate;
        $.ajax({
            url: '/Home/GetPOHeadObject',
            contentType: 'application/json',
            //data: { name: self.nameSearching() },
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
        debugger
        $.ajax({
            url: '/Home/GetPOLineList',
            contentType: 'application/json',
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
    self.POLineList = ko.observableArray(listPOLineTemp);

    //Init row of PO Line
    self.poLineRow = ko.observable(new self.POLineModelInit("", "", "", 0, 0, "", 0));
    self.TotalPrice = ko.computed(function () {
        return self.poLineRow().QtyOrder * self.poLineRow().BuyPrice;
    })
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
   
    ko.applyBindings(new PODetailViewModel(), document.body);
})