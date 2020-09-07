using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FinalExamPurchaseOrderManagement.BussinessLogic.Model
{
    public class SentMailObject
    {
        public string From { get; set; }
        public string To { get; set; }
        public string Cc { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
    }
}