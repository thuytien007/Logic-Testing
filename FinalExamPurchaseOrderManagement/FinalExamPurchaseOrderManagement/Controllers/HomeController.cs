using FinalExamPurchaseOrderManagement.BussinessLogic.POService;
using FinalExamPurchaseOrderManagement.Models;
using System.Net;
using System.Web.Mvc;

namespace FinalExamPurchaseOrderManagement.Controllers
{
    public class HomeController : Controller
    {
        private FinalExamPOListEntities db;
        private POService poService;

        public HomeController()
        {
            db = new FinalExamPOListEntities();
            poService = new POService(db);
        }
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult SentMail()
        {
            return View();
        }

        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            PurchaseOrder detail = db.PurchaseOrders.Find(id);
            if (detail == null)
            {
                return HttpNotFound();
            }
            TempData["OrderNo"] = id;
            return View(detail);
        }

        //get PO list for main screen 
        [HttpGet]
        public JsonResult GetPOList()
        {
            var result = poService.GetPOList();

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //get PO Head Object
        [HttpGet]
        public JsonResult GetPOHeadObject(int id)
        {
            var result = poService.GetPOHeadObject(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //get PO Line List (Part)
        [HttpGet]
        public JsonResult GetPOLineList(int id)
        {
            var result = poService.GetPOLineList(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}