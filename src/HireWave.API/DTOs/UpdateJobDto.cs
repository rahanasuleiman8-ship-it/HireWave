using HireWave.API.Models.Enums;

namespace HireWave.API.DTOs;

public class UpdateJobDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Company { get; set; }
    public string? Location { get; set; }
    public decimal? SalaryMin { get; set; }
    public decimal? SalaryMax { get; set; }
    public JobType? JobType { get; set; }
    public bool? IsActive { get; set; }
}
