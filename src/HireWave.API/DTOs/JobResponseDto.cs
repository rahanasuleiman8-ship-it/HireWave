namespace HireWave.API.DTOs;

public class JobResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public decimal? SalaryMin { get; set; }
    public decimal? SalaryMax { get; set; }
    public string JobType { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime PostedAt { get; set; }
    public string EmployerId { get; set; } = string.Empty;
    public string EmployerName { get; set; } = string.Empty;
}
