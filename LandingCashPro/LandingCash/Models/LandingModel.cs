using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace LandingCash.Models
{
    public class LandingModel
    {
        public int LandingId { get; set; }
        public int Code { get; set; }
        public string CostCenter { get; set; }
        public string Dept { get; set; }
        public string Nominal { get; set; }
        public string Description { get; set; }
        public string EstimateTotal { get; set; }

        public int ActualsId { get; set; }
        [RegularExpression(@"^\d*\.?\d*$", ErrorMessage = "Please enter a valid decimal number.")]
        public Nullable<decimal> Actuals { get; set; }
    }

    public class LandingListModel
    {
        public int IsSave { get; set; }
        public int ReportTypeId { get; set; }
        public int MonthId { get; set; }
        public List<SelectListItem>? ReportTypes { get; set; }
        public List<LandingModel> LandingModel { get; set; }
    }

    public class LandingReportModel
    {
        public int ReportTypeId { get; set; }
        public List<SelectListItem>? ReportTypes { get; set; }
        public List<LandingReportListModel> List { get; set; }
    }

    public class LandingReportListModel
    {
        public int LandingId { get; set; }
        public int Code { get; set; }
        public string CostCenter { get; set; }
        public string Dept { get; set; }
        public string Nominal { get; set; }
        public string Description { get; set; }
        public decimal? January { get; set; }
        public decimal? February { get; set; }
        public decimal? March { get; set; }
        public decimal? April { get; set; }
        public decimal? May { get; set; }
        public decimal? June { get; set; }
        public decimal? July { get; set; }
        public decimal? August { get; set; }
        public decimal? September { get; set; }
        public decimal? October { get; set; }
        public decimal? November { get; set; }
        public decimal? December { get; set; }
        public string? JanuaryEst { get; set; }
        public string? FebruaryEst { get; set; }
        public string? MarchEst { get; set; }
        public string? AprilEst { get; set; }
        public string? MayEst { get; set; }
        public string? JuneEst { get; set; }
        public string? JulyEst { get; set; }
        public string? AugustEst { get; set; }
        public string? SeptemberEst { get; set; }
        public string? OctoberEst { get; set; }
        public string? NovemberEst { get; set; }
        public string? DecemberEst { get; set; }
        public decimal TotalActuals { get; set; }
    }
}