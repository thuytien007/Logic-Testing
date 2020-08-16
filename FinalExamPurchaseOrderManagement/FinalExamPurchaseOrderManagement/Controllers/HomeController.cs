using FinalExamPurchaseOrderManagement.Models;
using System.Linq;
using System.Net;
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
        public ActionResult SentMail()
        {
            return View();
        }
        //public PurchaseOrder getById(int id)
        //{
        //    return db.PurchaseOrders.Where(x => x.OrderNo == id).FirstOrDefault();
        //}
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
            var result = from p in db.PurchaseOrders
                          join s in db.Suppliers on p.SupplierNo equals s.SupplierNo
                          join st in db.StockSites on p.StockSiteNo equals st.StockSiteNo                         
                          select new {p.OrderNo, s.SupplierCode, st.StockSiteCode, st.StockSiteName,p.OrderDate, p.LastUpdate, p.SentEmail};
            result.ToList();

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //get PO Head Object
        [HttpGet]
        public JsonResult GetPOHeadObject()
        {
            var resultPOHead = from p in db.PurchaseOrders
                               join s in db.Suppliers on p.SupplierNo equals s.SupplierNo
                               join st in db.StockSites on p.StockSiteNo equals st.StockSiteNo
                               where p.OrderNo == 1
                               select new { s.SupplierCode, s.SupplierName, st.StockSiteCode, st.StockSiteName, p.OrderDate, p.Country, p.Note, p.Address, p.PostCode };

            var result = resultPOHead.FirstOrDefault();
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //get PO Line List (Part)
        [HttpGet]
        public JsonResult GetPOLineList()
        {
            var resultPOLine = from p in db.PurchaseOrders
                               join pl in db.PurchaseOrderLines on p.OrderNo equals pl.OrderNo
                               join pt in db.Parts on pl.PartNo equals pt.PartNo
                               join m in db.Manufacturers on pt.ManufactureNo equals m.ManufactureNo
                               where p.OrderNo == 1
                               select new { pt.Partcode, pt.PartDescription, m.ManufacturName, pl.Amount, pt.BuyPrice, pl.Memo};

            var result = resultPOLine.ToList();
            return Json(result, JsonRequestBehavior.AllowGet);
        }

    }
}