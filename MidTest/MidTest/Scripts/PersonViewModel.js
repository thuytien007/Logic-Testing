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

ko.bindingHandlers.clickAndStop = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
        var handler = ko.utils.unwrapObservable(valueAccessor()),
            newValueAccessor = function () {
                return function (data, event) {
                    handler.call(viewModel, data, event);
                    event.cancelBubble = true;
                    if (event.stopPropagation) event.stopPropagation();
                };
            };

        ko.bindingHandlers.click.init(element, newValueAccessor, allBindingsAccessor, viewModel, context);
    }
};

//create an Object with fname, lname, age
function PersonModel(firstName, lastName, age) {
    this.firstName = ko.observable(firstName);
    this.lastName = ko.observable(lastName);
    this.age = ko.observable(age);
};

//loop array object, if pass condition then add to tempList
function selectedUserList(oriArray) {
    this.tempList = [];
    oriArray.forEach(function (item) { 
        if (item.firstName.length + item.lastName.length > 12 && item.firstName.charAt(0) == "M") {
            var age = Math.floor(Math.random() * 99) + 1;
            var user = new PersonModel(item.firstName, item.lastName, age);
            this.tempList.push(user);
        }
    })
    return tempList;
}

//sum age with selected user
function sumAgeWithSelectedUser(arrObject) {
    var sumAge = 0;
    arrObject.forEach(function (item) {
        sumAge += item.age();
    })
    return sumAge;
}

//function changeDataArray(personList, removedList, currentRowObject) {
//    personList.remove(currentRowObject);
//    removedList.push(currentRowObject);
//}

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

    //initial object person empty
    self.objectSelectedRow = ko.observable(new PersonModel("","",0));
    //select row click by user
    self.selectedUser = function (item) {
        self.objectSelectedRow(item);
    }

    //get age range
    self.agePeriod = ko.computed(function () {
        var status = " ";
        if (self.objectSelectedRow().age() < 15)
            status = "Teenager";
        if (self.objectSelectedRow().age() > 62)
            status = "Retired";
        else
            status = "undefine age range";
        return status;
    })

    //get fullname
    self.fullName = ko.computed(function(){
        return self.objectSelectedRow().firstName() + " " + self.objectSelectedRow().lastName();
    });

    self.removedPersonList = ko.observableArray();
    self.sumAgeRemovedPersonList = ko.computed(function () {
        return sumAgeWithSelectedUser(self.removedPersonList());
    });

    self.removePerson = function () {
        self.selectedPerson.remove(self.objectSelectedRow());
        self.removedPersonList.push(self.objectSelectedRow());
        self.sumAge - self.objectSelectedRow().age();
    };

    self.undoPerson = function () {
        self.removedPersonList.remove(self.objectSelectedRow());
        self.selectedPerson.push(self.objectSelectedRow());    
    }
}

ko.applyBindings(new PersonViewModel());