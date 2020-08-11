
//main ViewModel
function POViewModel() {
    var self = this;
    //Init PO Model Object
    self.POModelInit = function (OrderNo, SupplierCode, StockSiteCode, StockSiteName, OrderDate, LastUpdate, SentEmail) {
        //debugger
        self.OrderNo = ko.observable(OrderNo);
        self.SupplierCode = ko.observable(SupplierCode);
        self.StockSiteCode = ko.observable(StockSiteCode);
        self.StockSiteName = ko.observable(StockSiteName);
        self.OrderDate = ko.observable(OrderDate);
        self.LastUpdate = ko.observable(LastUpdate);
        self.SentEmail = ko.observable(SentEmail);
    };
    //Init temp po list to get data from controller
    var poSampleList = [];
    //Init row of po list
    self.poRow = ko.observable(new self.POModelInit(0, "", "", "", "", "", false));

    //function to format date
    self.formatDate = function (date) {
        var oldDate = new Date(parseInt(date.replace(/(^.*\()|([+-].*$)/g, '')));
        var newDate = oldDate.getDate() + "/" + (oldDate.getMonth() + 1) + "/" + oldDate.getFullYear();
        return newDate;
    }
    //get PO list for the main screen
    self.getPOList = function () {
        debugger
        var orderDate;
        var lastUpdate;
        $.ajax({
            url: '/Home/GetPOList',
            contentType: 'application/json',
            type: "GET",
            async: false,
            success: function (data) {
                poSampleList = data;
                console.log("get data success");
            },
            error: function () {
                console.log("error with get data");
            }
        });
        poSampleList.forEach(function (item) {
            orderDate = self.formatDate(item.OrderDate);
            item.OrderDate = orderDate;
            lastUpdate = self.formatDate(item.LastUpdate);
            item.LastUpdate = lastUpdate;
        })
        return poSampleList;
    }
    poSampleList = self.getPOList();
    self.resultFromGetPOList = ko.observableArray(poSampleList);
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

    ko.applyBindings(new POViewModel(), document.body);
})