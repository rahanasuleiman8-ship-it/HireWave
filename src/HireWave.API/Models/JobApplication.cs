using HireWave.API.Models.Enums;

namespace HireWave.API.Models;

public class JobApplication
{
    public int Id { get; set; }
    public string? CoverLetter { get; set; }
    public string? CvFilePath { get; set; }
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Applied;
    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public int JobId { get; set; }
    public Job Job { get; set; } = null!;

    public string ApplicantId { get; set; } = string.Empty;
    public ApplicationUser Applicant { get; set; } = null!;
}
