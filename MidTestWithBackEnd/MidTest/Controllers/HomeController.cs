using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using MidTest.Models;

namespace MidTest.Controllers
{
    public class PersonService
    {
        PersonInfoEntities _db;
        public PersonService(PersonInfoEntities db)
        {
            _db = new PersonInfoEntities();
        }

        public List<Person> GetPersonListWithCondition()
        {
            var personList = _db.Persons.Where(n => n.firstName.Length + n.lastName.Length > 12 && n.firstName.StartsWith("M")).ToList();
            return personList;
        }
    }
    public class HomeController : Controller
    {
        private PersonInfoEntities db;
        private PersonService personService;
        public HomeController()
        {
            db = new PersonInfoEntities();
            personService = new PersonService(db);
        }
        
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetAllPersonList()
        {
            return Json(db.Persons.ToList(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPersonListWithCondition()
        {
            //var personList = db.Persons.Where(n => n.firstName.Length + n.lastName.Length > 12 && n.firstName.StartsWith("M")).ToList();
            var personList = personService.GetPersonListWithCondition();
            return Json(personList, JsonRequestBehavior.AllowGet);
        }

        //find person accoring to firstname or lastname
        [HttpGet]
        public JsonResult PersonListSearch(string name)
        {
            var selectedListPerson = personService.GetPersonListWithCondition();
            var result = selectedListPerson.Where(n => n.firstName.Contains(name) == true || n.lastName.Contains(name) == true).ToList();
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //update person
        [HttpPost]
        public string UpdatePerson(Person person)
        {
            var updatePerson = db.Persons.Find(person.Id);
            updatePerson.lastName = person.firstName;
            updatePerson.lastName = person.lastName;
            updatePerson.age = person.age;
            db.SaveChanges();
            return "Updated successfully";
        }

        //add person
        [HttpPost]
        public string AddPerson(Person person)
        {
            Person p = new Person();
            p.firstName = person.firstName;
            p.lastName = person.lastName;
            p.age = person.age;
            db.Persons.Add(p);
            db.SaveChanges();
            return "Add person successfully";
        }

        //delete person
        [HttpPost]
        public string DeletePerson(Person person)
        {
            var idDeletePerson = db.Persons.Find(person.Id);
            db.Persons.Remove(idDeletePerson);
            db.SaveChanges();
            return "Delete person successfully";
        }
    }
}