
var userSample = [];

//get list person from db through controller
function getPerson() {
    $.ajax({
        url: '/Home/GetPersonListWithCondition',
        contentType: 'application/json',
        type: "GET",
        async: false,
        success: function (data) {
            userSample = data;
            console.log("success");
        },
        error: function () {
            console.log("error");
        }
    });
    return userSample;
}

//loop array object, if pass the condition then add to tempList
//function selectedUserList(oriArray) {
//    try {
//        this.tempList = [];
//        oriArray.forEach(function (item) {
//            if (item.firstName.length + item.lastName.length > 12 && item.firstName.charAt(0) == "M") {
//                var age = Math.floor(Math.random() * 99) + 1;
//                var user = new PersonModel(item.Id, item.firstName, item.lastName, age);
//                this.tempList.push(user);
//            }
//        })
//        return tempList;
//    } catch (err) {
//        console.log(err.message);
//    }
//}

//sum age with selected user list
function sumAgeWithSelectedUser(arrObject) {
    try {
        var sumAge = 0;
        arrObject.forEach(function (item) {
            //must be parse to int because when we update it from view, it's a string
            sumAge += parseInt(item.age);
        })
        return sumAge;
    } catch (err) {
        console.log(err.message);
    }
}

//this function to validate input with first name
ko.extenders.requiredFirstName = function (target, overrideMessage) {
    //add some sub-observables to our observable
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();

    //define a function to do validation
    function validate(newValue) {
        var check = false;
        if (newValue.length < 5 || newValue.length > 10 || newValue.charAt(0) != "M")
            check = true;
        target.hasError(check == false ? false : true);
        target.validationMessage(check == false ? "" : overrideMessage || null);
    }

    //initial validation
    validate(target());

    //validate whenever the value changes
    target.subscribe(validate);

    //return the original observable
    return target;
};

//create an Object with firstName, lastName, age
function PersonModel(Id, firstName, lastName, age) {
    var self = this;
    self.Id = ko.observable(Id);
    self.firstName = ko.observable(firstName).extend({ requiredFirstName: "first name must larger than 5, lower than 10 and start with M" });
    //ko.validation() support some extend patterns (rules) like min-max lengh, so not need an extend function for validate
    //except your validation need more condition to validate.
    self.lastName = ko.observable(lastName).extend({ required: true, minLength: 5, maxLength: 10 });
    self.age = ko.observable(age).extend({ required: true, min: 1, max: 100 });
};

//main ViewModel
function PersonViewModel() {
    var self = this;
    //list of all person
    userSample = getPerson();
    //self.allPerson = ko.observableArray(userSample);

    //list of selected person with condition
    self.selectedPerson = ko.observableArray(userSample);

    //sum all age of selected person
    self.sumAge = ko.computed(function () {
        return sumAgeWithSelectedUser(self.selectedPerson());
    });

    //initial an object selected person empty
    self.objectSelectedRow = ko.observable(new PersonModel(0, "", "", 0));

    //select row click by user
    self.selectedUser = function (item) {
        self.objectSelectedRow(item);
        self.selectedPerson.remove(item);
        self.removedPersonList.push(item);
        self.sumAge - self.objectSelectedRow().age;
    }

    //initial removed person list empty
    self.removedPersonList = ko.observableArray(null);

    //sum age of removed person list
    self.sumAgeRemovedPersonList = ko.computed(function () {
        return sumAgeWithSelectedUser(self.removedPersonList());
    });

    //initial an object removed person empty
    self.objectUndoRow = ko.observable(new PersonModel(0, "", "", 0));
    //select undo row click by user
    self.selectedUndoUser = function (item) {
        self.objectUndoRow(item);
        self.selectedPerson.push(item);
        self.removedPersonList.remove(item);
        self.sumAgeRemovedPersonList - self.objectUndoRow().age;
    }

    //get age range (write direct function in ViewModel)
    self.agePeriod = ko.computed(function () {
        var status = "";
        if (self.objectSelectedRow().age <= 0)
            status = "";
        else {
            if (self.objectSelectedRow().age < 15)
                status = "Teenager";
            else {
                if (self.objectSelectedRow().age > 62)
                    status = "Retired";
                else
                    status = "Adult";
            }
        }
        return status;
    });

    //get fullname
    self.fullName = ko.computed(function () {
        return self.objectSelectedRow().firstName + " " + self.objectSelectedRow().lastName;
    });

    self.updatePerson = function () {
        var error = ko.validation.group(self.objectSelectedRow);
        var updateUser = ko.toJSON(self.objectSelectedRow);
        if (error().length === 0) {
            $('div.alert-success').show();
            $.ajax({
                url: '/Home/UpdatePerson',
                contentType: 'application/json',
                data: updateUser,
                type: "POST",
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
        alert("success");
        window.location.href = '/Home/Index/';
    }
    self.errorCallback = function () {
        alert("failed");
        window.location.href = '/Home/Index/';
    }

    self.addPerson = function () {
        var error = ko.validation.group(self.objectSelectedRow);
        var addUser = ko.toJSON(self.objectSelectedRow);

        if (error().length === 0) {
            $.ajax({
                url: '/Home/AddPerson',
                contentType: 'application/json',
                data: addUser,
                type: "POST",
                async: false,
                success: self.successCallback,
                error: self.errorCallback
            });
            $('div.alert-success').show();
        } else {
            alert('Please check your submission');
            $('div.alert-danger').show();
        }
    }

    //this is use bootstrap dialog
    self.deletePerson = function () {
        $.ajax({
            url: '/Home/DeletePerson',
            contentType: 'application/json',
            data: ko.toJSON(self.objectSelectedRow),
            type: "POST",
            async: false,
            success: self.successCallback,
            error: self.errorCallback
        });
    }

    //serve for name searching
    self.nameSearching = ko.observable("");
    
    self.getResultPersonSearch = function () {
        //comment below use when you wanna a Cancel button to reload ori list after result from searching
        //if (self.nameSearching() == "")
        //    alert("Please fill name to search!!");
        //else { }
        $.ajax({
            url: '/Home/PersonListSearch',
            contentType: 'application/json',
            data: { name: self.nameSearching() },
            type: "GET",
            async: false,
            success: function (data) {
                self.selectedPerson(data);
                console.log("success");
            },
            error: function () {
                alert("Not Found");
            }
        });
        return self.selectedPerson; 
    }

    //$.noConflict();//not need noConflict() in here because in _Layout we render Bundle first
    //and delete manual import script jquery, it will render 2 times so it will conflict

    //this is use jquery dialog
    //self.deletePerson = function (item) {
    //    self.objectSelectedRow(item);
    //    $("#dialog-confirm").dialog({
    //        resizable: false,
    //        height: 140,
    //        modal: true,
    //        buttons: {
    //            "Delete": function () {
    //                $(this).dialog("close");
    //                $.ajax({
    //                    url: '/Home/DeletePerson',
    //                    contentType: 'application/json',
    //                    data: ko.toJSON(self.objectSelectedRow),
    //                    type: "POST",
    //                    async: false,
    //                    success: self.successCallback,
    //                    error: self.errorCallback
    //                });
    //            },
    //            Cancel: function () {
    //                $(this).dialog("close");
    //            }
    //        }
    //    });
    //}  
}

//use jQuery to make sure the html is finished, then js will run with no matter where js is put in the html
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
 
    ko.applyBindings(new PersonViewModel(), document.body);
})

