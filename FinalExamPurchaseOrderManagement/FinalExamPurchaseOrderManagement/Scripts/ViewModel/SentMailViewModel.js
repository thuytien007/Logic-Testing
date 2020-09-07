function SentMailViewModel() {
    //get Id from PO List screen
    var Id = parseInt($('#smOrderId').val());
    var self = this;

    //get data to show on PO Head
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

    self.smSubject = ko.computed(function () {
        return 'Order - [ ' + self.smObject().OrderNo + ' - ' + self.smObject().StockSiteName + ' ]';
    })

    self.smContent = ko.computed(function () {
        return 'Hi,\r\n\r\nPlease process the attached order directly into our customer as stipulated on the attached PO.\r\n\r\nPO Number: ' + self.smObject().OrderNo + '\r\n\r\nKind Regards,';
    })

    self.SentMailModel = function () {
        var _this = this;
        _this.OrderNo = Id;
        _this.From = ko.observable(self.smObject().StockEmail);
        _this.To = ko.observable(self.smObject().SupplierEmail);
        _this.Cc = ko.observable();
        _this.Subject = ko.observable(self.smSubject());
        _this.Content = ko.observable(self.smContent());
        return _this;
    }

    //self.sentMailObser = ko.observable(self.SentMailModel());
    self.sentMailObser = ko.observable(new self.SentMailModel());

    self.sentMail = function () {
        debugger
        $.ajax({
            url: '/Home/SentMail',
            contentType: 'application/json',
            data: ko.toJSON({ smObject: self.sentMailObser }),
            type: "POST",
            async: false,
            success: self.successCallback,
            error: self.errorCallback
        });
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
        //using grouping with deep because we have arrayobject, need to get object inside array
        //deep helps us access into that object
        //grouping: { deep: true, observable: true },
        messageTemplate: null
    }, true);

    ko.validation.registerExtenders();

    //applyBindings for specific screen to avoid error multiple apply
    ko.applyBindings(new SentMailViewModel(), document.getElementById('sent-mail'));
})