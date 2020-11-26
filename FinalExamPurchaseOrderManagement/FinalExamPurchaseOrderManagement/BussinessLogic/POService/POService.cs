using FinalExamPurchaseOrderManagement.BussinessLogic.Model;
using FinalExamPurchaseOrderManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Windows;

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
                                   SupplierEmail = s.Email,
                                   StockSiteCode = st.StockSiteCode,
                                   StockSiteName = st.StockSiteName,
                                   StockEmail = st.Email,
                                   OrderDate = p.OrderDate,
                                   Country = p.Country,
                                   Note = p.Note,
                                   Address = p.Address,
                                   PostCode = p.PostCode,
                                   Cancel = p.Cancel,
                                   //also get sent email to serve for checkbox of SM Screen
                                   SentEmail = p.SentEmail
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
                                   Price = pl.Price,
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
                //this Init to get the value first, then LinQ easy to understand this is a value,
                //sqlserver is just understand value, not object
                var partNum = poLine[i].PartNo;
                var orderNum = poLine[i].OrderNo;
                if(orderNum == 0)
                {
                    var newPOLine = new PurchaseOrderLine()
                    {
                        OrderNo = poHead.OrderNo,
                        PartNo = poLine[i].PartNo,
                        Amount = poLine[i].Amount,
                        Price = poLine[i].Price,
                        Memo = poLine[i].Memo
                    };

                    _db.PurchaseOrderLines.Add(newPOLine);
                    _db.SaveChanges();
                }
                else
                {
                    var updatePOLine = _db.PurchaseOrderLines.FirstOrDefault(pl => (pl.PartNo == partNum) && (pl.OrderNo == orderNum));
                    updatePOLine.Amount = poLine[i].Amount;
                    updatePOLine.Price = poLine[i].Price;
                    updatePOLine.Memo = poLine[i].Memo;
                    _db.SaveChanges();
                }    
            }
            return "update success";
        }

        //handle cancel po button
        public string UpdateCancelPO(POHead pOHead, List<POLine> poLine)
        {
            try
            {
                var updateCancelPO = _db.PurchaseOrders.Find(pOHead.OrderNo);
                updateCancelPO.Cancel = true;
                _db.SaveChanges();
                for (int i = 0; i < poLine.Count; i++)
                {
                    //update POLine table: QtyOrder + Price(currentprice) = 0
                    var partNum = poLine[i].PartNo;
                    var orderNum = poLine[i].OrderNo;
                    var updatePOLine = _db.PurchaseOrderLines.FirstOrDefault(pl => (pl.PartNo == partNum) && (pl.OrderNo == orderNum));
                    updatePOLine.Amount = 0;
                    updatePOLine.Price = 0;
                    _db.SaveChanges();
                }

            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
            return "calcel po sucess";
        }
        //handle add button, add a new line in po line
        public List<POLine> AddNewPOLine(int id)
        {
            List<POLine> result = new List<POLine>();
            try
            {
                var getPOLineList = GetPOLineList(id);

                var allPOLine = (from pt in _db.Parts
                                 join m in _db.Manufacturers on pt.ManufactureNo equals m.ManufactureNo
                                 select new POLine
                                 {
                                     //OrderNo = pl.OrderNo,
                                     PartNo = pt.PartNo,
                                     Partcode = pt.Partcode,
                                     PartDescription = pt.PartDescription,
                                     ManufactureName = m.ManufacturName,
                                     //Amount = pl.Amount,
                                     Price = pt.BuyPrice,
                                     //Memo = pl.Memo
                                 }).ToList();

                //if you want to use Except in here, on POLine Model you must make a function Equal to compare attribute that you want
                result = allPOLine.Except(getPOLineList).ToList();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
            return result;
        }

        //delete po line
        public string DeletePOLine(POLine poLine)
        {
            try
            {
                var deletePOLine = _db.PurchaseOrderLines.FirstOrDefault(o => o.OrderNo == poLine.OrderNo && o.PartNo == poLine.PartNo);
                _db.PurchaseOrderLines.Remove(deletePOLine);
                _db.SaveChanges();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return "Delete PO Line failed";
            }
            
            return "Delete PO Line successfully";
        }

        //handle sent mail
        public void SentMail(SentMailObject smObject)
        {
            try
            {
                //update sentmail column in db to True
                var updateId = _db.PurchaseOrders.Find(smObject.OrderNo);
                updateId.SentEmail = true;
                _db.SaveChanges();

                //sent mail to someone
               
                SmtpClient client = new SmtpClient("smtp.gmail.com");
          
                client.UseDefaultCredentials = false;
                //NetworkCredential lg = new NetworkCredential("tientien@gmail.com", "hahaha");
                client.Credentials = new NetworkCredential("camassasantiago2004n@gmail.com", "123456789$bv");
                client.EnableSsl = true;
                client.Port = 587;
                MailMessage mgs = new MailMessage();
                mgs.From = new MailAddress(smObject.From, "Tien Nguyen", System.Text.Encoding.UTF8);
                mgs.To.Add(new MailAddress(smObject.To));
                if (!string.IsNullOrEmpty(smObject.Cc))
                    mgs.To.Add(new MailAddress(smObject.Cc));
                mgs.Subject = smObject.Subject;
                mgs.SubjectEncoding = System.Text.Encoding.UTF8;
                mgs.Body = smObject.Content;
                mgs.BodyEncoding = System.Text.Encoding.UTF8;
                mgs.IsBodyHtml = true;
                mgs.Priority = MailPriority.Normal;
                mgs.DeliveryNotificationOptions = DeliveryNotificationOptions.OnFailure;
                client.Send(mgs);
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);               
            }
        }
    }
}