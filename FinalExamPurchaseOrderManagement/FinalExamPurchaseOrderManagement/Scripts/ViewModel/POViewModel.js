//main ViewModel (PO List)
function POViewModel() {
    var self = this;

    //function to format date
    self.formatDate = function (date) {
        var oldDate = new Date(parseInt(date.replace(/(^.*\()|([+-].*$)/g, '')));
        var newDate = ("0" + oldDate.getDate()).slice(-2) + "/" +
            ("0" + (oldDate.getUTCMonth() + 1)).slice(-2) + "/" +
            oldDate.getFullYear() + " " +
            ("0" + oldDate.getHours()).slice(-2) + ":" +
            ("0" + oldDate.getMinutes()).slice(-2) + ":" +
            ("0" + oldDate.getSeconds()).slice(-2);
        return newDate;
    }
   
    //Init temp PO list to get data from controller
    var poSampleList = [];

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
    ko.applyBindings(new POViewModel(), document.getElementById('index'));
})