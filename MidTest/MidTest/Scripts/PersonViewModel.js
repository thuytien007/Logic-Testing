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

//sum age with selected user
function sumAgeWithSelectedUser(arrObject) {
    try {
        var sumAge = 0;
        arrObject.forEach(function (item) {
            sumAge += item.age();
        })
        return sumAge;
    } catch (err) {
        console.log(err.message);
    } 
}

//main ViewModel
function PersonViewModel() {
    var self = this;

    //list of all person
    self.allPerson = ko.observableArray(userSample);

    //list of selected person with condition
    self.selectedPerson = ko.observableArray(selectedUserList(userSample));

    //create an Object with firstName, lastName, age
    var PersonModel = function(firstName, lastName, age) {
        self.firstName = ko.observable(firstName);
        self.lastName = ko.observable(lastName);
        self.age = ko.observable(age);
    };

    //sum all age of selected person
    self.sumAge = ko.computed(function () {
        return sumAgeWithSelectedUser(self.selectedPerson());
    });

    //initiala an object selected person empty
    self.objectSelectedRow = ko.observable(new PersonModel(self.firstName, self.lastName, self.age));

    //show object Person to input
    self.firstName = ko.computed(function () {
        return self.objectSelectedRow().firstName();
    });
    self.lastName = ko.computed(function () {
        return self.objectSelectedRow().lastName();
    });
    self.age = ko.computed(function () {
        return self.objectSelectedRow().age();
    });

    //select row click by user
    self.selectedUser = function (item) {
        self.objectSelectedRow(item);
        self.selectedPerson.remove(item);
        self.removedPersonList.push(item);
        self.sumAge - self.objectSelectedRow().age();
    }

    //self.updatePersonInfo = function () {
    //    var validate = "";
    //    if (self.firstName().length < 5 || self.firstName().length > 10)
    //        validate = "first name must have lengh more than 5 character and less than 10";
    //    if (self.lastName().length < 5 || self.lastName().length > 10)
    //        validate = "last name must have lengh more than 5 character and less than 10";
    //    else {
    //        validate = "update success!";
    //        self.objectSelectedRow().firstName() = self.firstName();
    //        self.objectSelectedRow().lastName() = self.lastName();
    //        self.objectSelectedRow().age() = self.age();
    //        self.selectedPerson.
    //    }
    //}
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