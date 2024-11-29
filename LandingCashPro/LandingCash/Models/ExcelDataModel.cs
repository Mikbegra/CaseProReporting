using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace LandingCash.Models
{
    public class ExcelDataModel
    {
        public string reportType { get; set; }
        public string code { get; set; }
        public string costcenter { get; set; }
        public string dept { get; set; }
        public string nominal { get; set; }
        public string description { get; set; }
        public int monthid { get; set; }
        public int yearid { get; set; }
        public decimal? actual { get; set; }
    }
}