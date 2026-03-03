using HireWave.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HireWave.API.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Job> Jobs => Set<Job>();
    public DbSet<JobApplication> JobApplications => Set<JobApplication>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Job>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Company).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Location).IsRequired().HasMaxLength(200);
            entity.Property(e => e.JobType).HasConversion<string>();

            entity.HasOne(e => e.Employer)
                  .WithMany()
                  .HasForeignKey(e => e.EmployerId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<JobApplication>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Status).HasConversion<string>();

            entity.HasOne(e => e.Job)
                  .WithMany(j => j.Applications)
                  .HasForeignKey(e => e.JobId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Applicant)
                  .WithMany()
                  .HasForeignKey(e => e.ApplicantId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.JobId, e.ApplicantId }).IsUnique();
        });
    }
}
