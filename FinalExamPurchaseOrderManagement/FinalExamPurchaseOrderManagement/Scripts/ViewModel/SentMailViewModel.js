function SentMailViewModel() {
    //get Id from PO List screen
    var Id = parseInt($('#smOrderId').val());
    var self = this;

    //get data to as PO Head to show on inputs
    var smObjectTemp = null;
    self.getResultSentMailObject = function () {
        $.ajax({
            url: '/Home/GetPOHeadObject',
            contentType: 'application/json',
            data: { id: Id },
            type: "GET",
            async: false,
            success: function (data) {
                smObjectTemp = data;
                console.log("success");
            },
            error: function () {
                alert("Not Found");
            }
        });
        return smObjectTemp;
    }
    //get Object result from db
    self.smObject = ko.observable(self.getResultSentMailObject());

    //get PO Line List at detail screen to show on content of email
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

    self.smSubject = ko.computed(function () {
        return 'Order - <' + self.smObject().OrderNo + ' - ' + self.smObject().StockSiteName + '>';
    })

    self.smContent = ko.computed(function () {
        var stringPOLine = "";
        for (var i = 0; i < listPOLineTemp.length; i++) {
            stringPOLine += "Part Name: " + '<' + listPOLineTemp[i].Partcode + '>' + "   " + "Qty: " + '<' + listPOLineTemp[i].Amount + '>' + "   " + "Price: " + "<" + listPOLineTemp[i].Price + '>' + "\r\n\r\n";
        }
        return 'Hi,\r\n\r\nPlease process the attached order directly into our customer as stipulated on the attached PO.\r\n\r\nPO Number: ' +
            self.smObject().OrderNo + '\r\n\r\n' + 'PO Line List:' + '\r\n\r\n' + stringPOLine + '\r\n\r\nKind Regards,';
    })

    //create a sent mail model to return back to database to sent to someone
    self.SentMailModel = function () {
        var _this = this;
        _this.OrderNo = Id;
        _this.From = ko.observable(self.smObject().StockEmail);
        _this.To = ko.observable(self.smObject().SupplierEmail).extend({required:true});
        _this.Cc = ko.observable();
        _this.Subject = ko.observable(self.smSubject());
        _this.Content = ko.observable(self.smContent());
        return _this;
    }

    //an observable SentMailModel auto change if user change on FORM
    self.sentMailObser = ko.observable(new self.SentMailModel());

    self.sentMail = function () {
        //var errorSentMail = ko.validation.group(self.sentMailObser());
        //if (errorSentMail().length === 0) {
            $.ajax({
                url: '/Home/SentMail',
                contentType: 'application/json',
                data: ko.toJSON({ smObject: self.sentMailObser }),
                type: "POST",
                async: false,
                success: self.successCallback,
                error: self.errorCallback
            });
        //} else {
           // alert('Please check your submission');
           // $('div.alert-danger').show();
        //}
    }

    self.successCallback = function () {
        alert("sent mail success");
        window.location.href = '/Home/SentMail/' + Id;
    }

    self.errorCallback = function () {
        alert("sent mail failed");
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
        messageTemplate: null
    }, true);

    ko.validation.registerExtenders();

    //applyBindings for specific screen to avoid error multiple apply
    ko.applyBindings(new SentMailViewModel(), document.getElementById('send-mail'));
})