
namespace FinalExamPurchaseOrderManagement.BussinessLogic.Model
{
    public class POLine
    {
        public int OrderNo { get; set; }
        public int PartNo { get; set; }
        public string Partcode { get; set; }
        public string PartDescription { get; set; }
        public string ManufactureName { get; set; }
        public int? Amount { get; set; }
        public double? Price { get; set; }
        public string Memo { get; set; }
    }
}