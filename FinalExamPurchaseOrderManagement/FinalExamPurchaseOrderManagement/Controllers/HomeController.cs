using FinalExamPurchaseOrderManagement.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace FinalExamPurchaseOrderManagement.Controllers
{
    //Init service
    public class POService
    {
        FinalExamPOListEntities _db;
        public POService(FinalExamPOListEntities db)
        {
            _db = db;
        }
    }
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
        public PurchaseOrder getById(int id)
        {
            return db.PurchaseOrders.Where(x => x.OrderNo == id).FirstOrDefault();

        }

        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            PurchaseOrder poDetails = db.PurchaseOrders.Find(id);
            if (poDetails == null)
            {
                return HttpNotFound();
            }
            return View(poDetails);
        }

        //get PO list for main screen 
        public JsonResult GetPOList()
        {
            var result = from p in db.PurchaseOrders
                          join s in db.Suppliers on p.SupplierNo equals s.SupplierNo
                          join st in db.StockSites on p.StockSiteNo equals st.StockSiteNo                         
                          select new {p.OrderNo, s.SupplierCode, st.StockSiteCode, st.StockSiteName,p.OrderDate, p.LastUpdate, p.SentEmail};
            result.ToList();

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}