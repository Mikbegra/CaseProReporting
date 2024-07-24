using LandingRepoModel.Entities;

namespace LandingRepoModel.RequestModel
{
    public partial class LandingDetail
    {
        public int LandingId { get; set; }
        public int Code { get; set; }
        public string CostCenter { get; set; }
        public string Dept { get; set; }
        public string Nominal { get; set; }
        public string Description { get; set; }
        public string EstimateTotal { get; set; }
        public ICollection<ActualsDetail> ActualDetails { get; set; }
    }
}