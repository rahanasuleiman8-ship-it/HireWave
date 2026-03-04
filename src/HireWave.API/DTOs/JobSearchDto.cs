namespace HireWave.API.DTOs;

public class JobSearchDto
{
    public string? Keyword { get; set; }
    public string? Location { get; set; }
    public string? JobType { get; set; }
    public decimal? MinSalary { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
