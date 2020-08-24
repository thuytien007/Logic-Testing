using FinalExamPurchaseOrderManagement.BussinessLogic.Model;
using FinalExamPurchaseOrderManagement.Models;
using System.Collections.Generic;
using System.Linq;

namespace FinalExamPurchaseOrderManagement.BussinessLogic.POService
{
    //this class call Model to get related objects
    public class POService
    {
        FinalExamPOListEntities _db;
        public POService(FinalExamPOListEntities db)
        {
            _db = db;
        }
        public List<POList> GetPOList()
        {
            var result = from p in _db.PurchaseOrders
                         join s in _db.Suppliers on p.SupplierNo equals s.SupplierNo
                         join st in _db.StockSites on p.StockSiteNo equals st.StockSiteNo
                         select new POList
                         {
                             OrderNo = p.OrderNo,
                             SupplierCode = s.SupplierCode,
                             StockSiteCode = st.StockSiteCode,
                             StockSiteName = st.StockSiteName,
                             OrderDate = p.OrderDate,
                             LastUpdate = p.LastUpdate,
                             SentEmail = p.SentEmail
                         };

            return result.ToList();
        }
        //get PO Head object with required OrderNo (id)
        public POHead GetPOHeadObject(int id)
        {
            var resultPOHead = from p in _db.PurchaseOrders
                               join s in _db.Suppliers on p.SupplierNo equals s.SupplierNo
                               join st in _db.StockSites on p.StockSiteNo equals st.StockSiteNo
                               where p.OrderNo == id
                               select new POHead
                               {
                                   OrderNo = p.OrderNo,
                                   SupplierCode = s.SupplierCode,
                                   SupplierName = s.SupplierName,
                                   StockSiteCode = st.StockSiteCode,
                                   StockSiteName = st.StockSiteName,
                                   OrderDate = p.OrderDate,
                                   Country = p.Country,
                                   Note = p.Note,
                                   Address = p.Address,
                                   PostCode = p.PostCode
                               };

            var result = resultPOHead.FirstOrDefault();
            return result;
        }

        //get PO Line list with required OrderNo (id)
        public List<POLine> GetPOLineList(int id)
        {
            var resultPOLine = from p in _db.PurchaseOrders
                               join pl in _db.PurchaseOrderLines on p.OrderNo equals pl.OrderNo
                               join pt in _db.Parts on pl.PartNo equals pt.PartNo
                               join m in _db.Manufacturers on pt.ManufactureNo equals m.ManufactureNo
                               where p.OrderNo == id
                               select new POLine
                               {
                                   OrderNo = pl.OrderNo,
                                   PartNo = pl.PartNo,
                                   Partcode = pt.Partcode,
                                   PartDescription = pt.PartDescription,
                                   ManufactureName = m.ManufacturName,
                                   Amount = pl.Amount,
                                   BuyPrice = pt.BuyPrice,
                                   Memo = pl.Memo
                               };

            var result = resultPOLine.ToList();
            return result;
        }

        //handle save button -> update PO Detail included PO Head & PO Line
        public string UpdatePODetail(POHead poHead, List<POLine> poLine)
        {
            //save PO Head
            var updatePO = _db.PurchaseOrders.Find(poHead.OrderNo);
            updatePO.Note = poHead.Note;
            updatePO.Address = poHead.Address;
            updatePO.Country = poHead.Country;
            updatePO.PostCode = poHead.PostCode;
            //save on PO List
            _db.SaveChanges();
            //save list of PO Line
            for (int i = 0; i < poLine.Count; i++)
            {
                var updatePartNo = _db.Parts.Find(poLine[i].PartNo);
                updatePartNo.BuyPrice = poLine[i].BuyPrice;
                //this Init to get the value first, then LinQ easy to understand this is a value,
                //sqlserver is just understand value, not object
                var partNum = poLine[i].PartNo;
                var orderNum = poLine[i].OrderNo;
                var updatePOLine = _db.PurchaseOrderLines.FirstOrDefault(pl => (pl.PartNo == partNum) && (pl.OrderNo == orderNum));
                updatePOLine.Amount = poLine[i].Amount;
                updatePOLine.Memo = poLine[i].Memo;
                _db.SaveChanges();
            }
            return "update success";
        }
    }
}