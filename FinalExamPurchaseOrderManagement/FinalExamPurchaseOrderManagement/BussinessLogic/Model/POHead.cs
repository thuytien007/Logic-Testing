using System;

namespace FinalExamPurchaseOrderManagement.BussinessLogic.Model
{
    public class POHead
    {
        public int OrderNo { get; set; }
        public string SupplierCode { get; set; }
        public string SupplierName { get; set; }
        public string SupplierEmail { get; set; }
        public string StockSiteCode { get; set; }
        public string StockSiteName { get; set; }
        public string StockEmail { get; set; }
        public DateTime? OrderDate { get; set; }
        public string Country { get; set; }
        public string Note { get; set; }
        public string Address { get; set; }
        public string PostCode { get; set; }
        public bool? Cancel { get; set; }
        public bool? SentEmail { get; set; }
    }
}