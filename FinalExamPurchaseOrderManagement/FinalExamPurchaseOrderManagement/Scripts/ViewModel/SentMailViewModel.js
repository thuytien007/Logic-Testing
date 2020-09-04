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
    self.smObject = ko.observable(smObjectTemp);
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