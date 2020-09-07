using FinalExamPurchaseOrderManagement.BussinessLogic.Model;
using FinalExamPurchaseOrderManagement.BussinessLogic.POService;
using FinalExamPurchaseOrderManagement.Models;
using System.Collections.Generic;
using System.Linq;
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
        public ActionResult SentMail(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            PurchaseOrder sentMail = db.PurchaseOrders.Find(id);
            if (sentMail == null)
            {
                return HttpNotFound();
            }
            TempData["OrderNo"] = id;
            return View(sentMail);
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

        //update PO Detail
        [HttpPost]
        public JsonResult UpdatePODetails(POHead poHead, List<POLine> poLine)
        {
            var result = poService.UpdatePODetail(poHead, poLine);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //update cancel PO
        [HttpPost]
        public JsonResult UpdateCancelPO(POHead poHead, List<POLine> poLine)
        {
            var result = poService.UpdateCancelPO(poHead, poLine);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //handle add PO Line function
        [HttpGet]
        public JsonResult AddPOLine(int id)
        {
            var result = poService.AddNewPOLine(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //delete po line
        [HttpPost]
        public JsonResult DeletePerson(POLine poLine)
        {
            var result = poService.DeletePOLine(poLine);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //sent mail
        [HttpPost]
        public JsonResult SentMail(int id, SentMailObject smObject)
        {
            var result = poService.SentMail(id, smObject);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}