using LandingRepoModel.RequestModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace LandingRepoModel.Entities
{
    public class MonthEstimate
    {
        public int Id { get; set; }
        public int LandingId { get; set; }
        public int MonthId { get; set; }
        public decimal? Estimated { get; set; }
    }
}