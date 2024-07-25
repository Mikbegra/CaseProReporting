using LandingRepoModel.Entities;
using LandingRepoModel.RequestModel;
using Microsoft.EntityFrameworkCore;

namespace Modelcasepro.Entities
{

    public partial class LandingCaseproDbContext : DbContext
    {
        public LandingCaseproDbContext()
        {
        }

        public LandingCaseproDbContext(DbContextOptions<LandingCaseproDbContext> options) : base(options)
        {
        }

        public virtual DbSet<UsersTable> UsersTables { get; set; }

        public virtual DbSet<LandingDetail> LandingDetails { get; set; }

        public virtual DbSet<ReportType> ReportTypes { get; set; }

        public virtual DbSet<ActualsDetail> ActualsDetails { get; set; }

        public virtual DbSet<MonthEstimate> MonthEstimates { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UsersTable>(entity =>
            {
                entity.ToTable("Users_table");

                entity.Property(e => e.ClientName).HasMaxLength(50);
                entity.Property(e => e.CreatedDate).HasColumnType("datetime");
                entity.Property(e => e.LastLogindate).HasColumnType("datetime");
                entity.Property(e => e.Password).HasMaxLength(50);
                entity.Property(e => e.Username).HasMaxLength(50);
            });

            modelBuilder.Entity<LandingDetail>(entity =>
            {
                entity.ToTable("LandingDetail");

                entity.HasKey(e => e.LandingId);
                entity.Property(e => e.LandingId);
                entity.Property(e => e.Code);
                entity.Property(e => e.CostCenter).HasMaxLength(100);
                entity.Property(e => e.Dept).HasMaxLength(100);
                entity.Property(e => e.Nominal).HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(200);
            });

            modelBuilder.Entity<ReportType>(entity =>
            {
                entity.ToTable("ReportType");

                entity.HasKey(e => e.ReportTypeId);
                entity.Property(e => e.ReportTypeId);
                entity.Property(e => e.ReportTypeName).HasMaxLength(50);
            });

            modelBuilder.Entity<ActualsDetail>(entity =>
            {
                entity.ToTable("ActualsDetail");

                entity.HasKey(e => e.ActualsId);
                entity.Property(e => e.Actuals);

            });

            modelBuilder.Entity<ActualsDetail>()
            .HasOne(ad => ad.ReportType)
            .WithMany(rt => rt.ActualDetails)
            .HasForeignKey(ad => ad.ReportTypeId)
            .IsRequired();

            modelBuilder.Entity<ActualsDetail>()
                .HasOne(ad => ad.LandingDetail)
                .WithMany(ld => ld.ActualDetails)
                .HasForeignKey(ad => ad.LandingId)
                .IsRequired();

            modelBuilder.Entity<MonthEstimate>(entity =>
            {
                entity.ToTable("MonthEstimate");

                entity.HasKey(e => e.Id);
                entity.Property(e => e.LandingId);
                entity.Property(e => e.MonthId);
                entity.Property(e => e.Estimated);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}