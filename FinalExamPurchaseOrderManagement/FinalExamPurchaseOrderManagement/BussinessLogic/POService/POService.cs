﻿using FinalExamPurchaseOrderManagement.BussinessLogic.Model;
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
        public POHead GetPOHeadObject(int id)
        {
            var resultPOHead = from p in _db.PurchaseOrders
                               join s in _db.Suppliers on p.SupplierNo equals s.SupplierNo
                               join st in _db.StockSites on p.StockSiteNo equals st.StockSiteNo
                               where p.OrderNo == id
                               select new POHead
                               {
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

        public List<POLine> GetPOLineList(int id)
        {
            var resultPOLine = from p in _db.PurchaseOrders
                               join pl in _db.PurchaseOrderLines on p.OrderNo equals pl.OrderNo
                               join pt in _db.Parts on pl.PartNo equals pt.PartNo
                               join m in _db.Manufacturers on pt.ManufactureNo equals m.ManufactureNo
                               where p.OrderNo == id
                               select new POLine
                               {
                                   Partcode = pt.Partcode,
                                   PartDescription = pt.PartDescription,
                                   ManufacturName = m.ManufacturName,
                                   Amount = pl.Amount,
                                   BuyPrice = pt.BuyPrice,
                                   Memo = pl.Memo
                               };

            var result = resultPOLine.ToList();
            return result;
        }
    }
}