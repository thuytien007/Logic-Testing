var userSample = [
    { firstName: 'Lynnia', lastName: 'Eady' },
    { firstName: 'Melaina', lastName: 'Beamon' },
    { firstName: 'Anya', lastName: 'Weldon' },
    { firstName: 'Leslie', lastName: 'Dickinson' },
    { firstName: 'Ellissa', lastName: 'Peck' },
    { firstName: 'Kaydince', lastName: 'Wallace' },
    { firstName: 'Mracelynn', lastName: 'Baxter' },
    { firstName: 'Kadince', lastName: 'Napier' },
    { firstName: 'Desiree', lastName: 'Evans' },
    { firstName: 'Syniah', lastName: 'Yount' },
    { firstName: 'Madelina', lastName: 'Raines' },
    { firstName: 'Dejai', lastName: 'Shute' },
    { firstName: 'Toryn', lastName: 'Kirby' },
    { firstName: 'Lyllian', lastName: 'Yost' },
    { firstName: 'Emilie', lastName: 'Allison' },
    { firstName: 'Emilia', lastName: 'Mcintyre' },
    { firstName: 'Suhaib', lastName: 'Glenn' },
    { firstName: 'Fanny', lastName: 'Cronan' },
    { firstName: 'Bo', lastName: 'Abston' },
    { firstName: 'Kriti', lastName: 'Rutledge' },
    { firstName: 'Georgia', lastName: 'Tamayo' },
    { firstName: 'Alivia', lastName: 'Higgins' },
    { firstName: 'Yamilet', lastName: 'Abernathy' },
    { firstName: 'Lanie', lastName: 'Maxwell' },
    { firstName: 'Araceli', lastName: 'Bravo' },
    { firstName: 'Astoria', lastName: 'Weyant' },
];

//loop array object, if pass condition then add to tempList
function selectedUserList(oriArray) {
    try {
        this.tempList = [];
        oriArray.forEach(function (item) {
            if (item.firstName.length + item.lastName.length > 12 && item.firstName.charAt(0) == "M") {
                var age = Math.floor(Math.random() * 99) + 1;
                var user = new PersonModel(item.firstName, item.lastName, age);
                this.tempList.push(user);
            }
        })
        return tempList;
    } catch (err) {
        console.log(err.message);
    } 
}

//sum age with selected user list
function sumAgeWithSelectedUser(arrObject) {
    try {
        var sumAge = 0;
        arrObject.forEach(function (item) {
            //must be parse to int because when we update it from view, it's a string
            sumAge += parseInt(item.age());
        })
        return sumAge;
    } catch (err) {
        console.log(err.message);
    } 
}

//create an Object with firstName, lastName, age
function PersonModel(firstName, lastName, age) {
    this.firstName = ko.observable(firstName);
    this.lastName = ko.observable(lastName);
    this.age = ko.observable(age);
};

ko.extenders.required = function (target, overrideMessage) {
    //add some sub-observables to our observable
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();

    //define a function to do validation
    function validate(newValue) {
        var check = false;
        if (newValue.length < 5 || newValue.length > 10 || newValue.charAt(0) != "M")
            check = true;
        target.hasError(check == false ? false : true);
        target.validationMessage(check ? true : overrideMessage || "lenght must lower than 5 and larger than 10 and start with M");
    }

    //initial validation
    validate(target());

    //validate whenever the value changes
    target.subscribe(validate);

    //return the original observable
    return target;
};

//main ViewModel
function PersonViewModel() {
    var self = this;

    //list of all person
    self.allPerson = ko.observableArray(userSample);

    //list of selected person with condition
    self.selectedPerson = ko.observableArray(selectedUserList(userSample));

    //sum all age of selected person
    self.sumAge = ko.computed(function () {
        return sumAgeWithSelectedUser(self.selectedPerson());
    });
   
    //initiala an object selected person empty
    self.objectSelectedRow = ko.observable(new PersonModel("", "", 0));

    //self.firstName = ko.computed(function () {
    //    return self.objectSelectedRow().firstName();
    //});

    //self.lastName = ko.computed(function () {
    //    return self.objectSelectedRow().lastName();
    //});

    //self.age = ko.computed(function () {
    //    return self.objectSelectedRow().age();
    //});

    self.firstName = ko.observable(self.objectSelectedRow().firstName()).extend({ required: "lenght must lower than 5 and larger than 10 and start with M" });
    self.lastName = ko.observable(self.objectSelectedRow().lastName()).extend({ required: "lenght must lower than 5 and larger than 10" });
    self.age = ko.observable(self.objectSelectedRow().lastName());

    //self.firstName = ko.observable(self.objectSelectedRow().firstName());  
    //self.lastName = ko.observable(self.objectSelectedRow().lastName());  
    //self.age = ko.observable(self.objectSelectedRow().age());   

    //select row click by user
    self.selectedUser = function (item) {
        self.objectSelectedRow(item);
        self.selectedPerson.remove(item);
        self.removedPersonList.push(item);
        self.sumAge - self.objectSelectedRow().age();
    }

    //initial removed person list empty
    self.removedPersonList = ko.observableArray(null);

    //sum age of removed person list
    self.sumAgeRemovedPersonList = ko.computed(function () {
        return sumAgeWithSelectedUser(self.removedPersonList());
    });  

    //initial an object removed person empty
    self.objectUndoRow = ko.observable(new PersonModel("", "", 0));
    //select undo row click by user
    self.selectedUndoUser = function (item) {
        self.objectUndoRow(item);
        self.selectedPerson.push(item);
        self.removedPersonList.remove(item);      
        self.sumAgeRemovedPersonList - self.objectUndoRow().age();      
    }

    //get age range (write direct function in ViewModel)
    self.agePeriod = ko.computed(function () {
        var status = "";
        if (self.objectSelectedRow().age() <= 0)
            status = "";
        else {
            if (self.objectSelectedRow().age() < 15)
                status = "Teenager";
            else {
                if (self.objectSelectedRow().age() > 62)
                    status = "Retired";
                else
                    status = "Adult";
            }    
        }      
        return status;
    })

    //get fullname
    self.fullName = ko.computed(function(){
        return self.objectSelectedRow().firstName() + " " + self.objectSelectedRow().lastName();
    });
}

ko.applyBindings(new PersonViewModel());