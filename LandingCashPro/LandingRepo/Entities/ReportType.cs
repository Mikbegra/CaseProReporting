namespace LandingRepoModel.Entities
{
    public class ReportType
    {
        public int ReportTypeId { get; set; }

        public string ReportTypeName { get; set; }

        public ICollection<ActualsDetail> ActualDetails { get; set; }
    }
}