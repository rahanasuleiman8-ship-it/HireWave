using HireWave.API.Models.Enums;

namespace HireWave.API.Models;

public class Job
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public decimal? SalaryMin { get; set; }
    public decimal? SalaryMax { get; set; }
    public JobType JobType { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime PostedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public string EmployerId { get; set; } = string.Empty;
    public ApplicationUser Employer { get; set; } = null!;

    public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
}
