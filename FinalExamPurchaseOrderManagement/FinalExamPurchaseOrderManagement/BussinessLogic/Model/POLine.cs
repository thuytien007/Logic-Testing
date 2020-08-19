
namespace FinalExamPurchaseOrderManagement.BussinessLogic.Model
{
    public class POLine
    {
        public string Partcode { get; set; }
        public string PartDescription { get; set; }
        public string ManufacturName { get; set; }
        public int? Amount { get; set; }
        public double? BuyPrice { get; set; }
        public string Memo { get; set; }
    }
}