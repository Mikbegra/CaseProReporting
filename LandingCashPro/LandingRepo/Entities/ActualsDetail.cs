using LandingRepoModel.RequestModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LandingRepoModel.Entities
{
    public class ActualsDetail
	{
        public int ActualsId { get; set; }
        
        public int ReportTypeId { get; set; }

        public int MonthId { get; set; }

        public int LandingId { get; set; }

        [RegularExpression(@"^\d*\.?\d*$", ErrorMessage = "Please enter a valid decimal number.")]
        public decimal Actuals { get; set; }

        public ReportType ReportType { get; set; }

        [ForeignKey("LandingId")]
        public LandingDetail LandingDetail { get; set; }
    }
}