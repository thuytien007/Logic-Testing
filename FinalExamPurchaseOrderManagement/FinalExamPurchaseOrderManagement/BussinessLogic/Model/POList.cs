using System;

namespace FinalExamPurchaseOrderManagement.BussinessLogic.Model
{
    public class POList
    {
        public int OrderNo { get; set; }
        public string SupplierCode { get; set; }
        public string StockSiteCode { get; set; }
        public string StockSiteName { get; set; }
        public DateTime? OrderDate { get; set; }
        public DateTime? LastUpdate { get; set; }
        public bool? SentEmail { get; set; }
    }
}