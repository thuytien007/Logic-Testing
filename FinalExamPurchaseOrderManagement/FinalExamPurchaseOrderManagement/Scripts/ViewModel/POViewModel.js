//function to format date
var formatDate = function (date) {
    var oldDate = new Date(parseInt(date.replace(/(^.*\()|([+-].*$)/g, '')));
    var newDate = ("0" + oldDate.getUTCDate()).slice(-2) + "/" +
        ("0" + (oldDate.getUTCMonth() + 1)).slice(-2) + "/" +
        oldDate.getUTCFullYear() + " " +
        ("0" + oldDate.getUTCHours()).slice(-2) + ":" +
        ("0" + oldDate.getUTCMinutes()).slice(-2) + ":" +
        ("0" + oldDate.getUTCSeconds()).slice(-2);
    return newDate;
}

//main ViewModel
function POViewModel() {
    var self = this;
    //Init PO Detai Model Object
    self.POModelInit = function (OrderNo, SupplierCode, StockSiteCode, StockSiteName, OrderDate, LastUpdate, SentEmail) {
        self.OrderNo = ko.observable(OrderNo);
        self.SupplierCode = ko.observable(SupplierCode);
        self.StockSiteCode = ko.observable(StockSiteCode);
        self.StockSiteName = ko.observable(StockSiteName);
        self.OrderDate = ko.observable(OrderDate);
        self.LastUpdate = ko.observable(LastUpdate);
        self.SentEmail = ko.observable(SentEmail);
    };
   
    //Init temp PO list to get data from controller
    var poSampleList = [];

    //Init row of po list
    var poRow = ko.observable(new self.POModelInit(0, "", "", "", "", "", false));

    //get PO list for the main screen
    self.getPOList = function () {
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
        //after had PO list from db, loop through and change format date to show on View
        poSampleList.forEach(function (item) {
            orderDate = formatDate(item.OrderDate);
            item.OrderDate = orderDate;
            lastUpdate = formatDate(item.LastUpdate);
            item.LastUpdate = lastUpdate;
        })
        return poSampleList;
    }
    poSampleList = self.getPOList();
    self.resultFromGetPOList = ko.observableArray(poSampleList);
}


$(function () {
    ko.applyBindings(new POViewModel(), document.getElementById('index'));
})