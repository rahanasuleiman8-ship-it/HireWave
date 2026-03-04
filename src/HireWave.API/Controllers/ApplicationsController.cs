using System.Security.Claims;
using HireWave.API.Data;
using HireWave.API.DTOs;
using HireWave.API.Models;
using HireWave.API.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HireWave.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicationsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public ApplicationsController(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub")!;

    // POST: api/applications — job seeker applies with CV upload
    [HttpPost]
    [Authorize(Roles = "JobSeeker")]
    public async Task<IActionResult> Apply([FromForm] CreateApplicationDto dto, IFormFile? cvFile)
    {
        var userId = GetUserId();

        // Check job exists and is active
        var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == dto.JobId && j.IsActive);
        if (job == null)
            return NotFound("Job not found or no longer active.");

        // Prevent duplicate applications
        var existing = await _context.JobApplications
            .FirstOrDefaultAsync(a => a.JobId == dto.JobId && a.ApplicantId == userId);
        if (existing != null)
            return BadRequest("You have already applied for this job.");

        // Handle CV upload
        string? cvFilePath = null;
        if (cvFile != null)
        {
            var allowedTypes = new[] { "application/pdf", "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };

            if (!allowedTypes.Contains(cvFile.ContentType))
                return BadRequest("Only PDF and Word documents are allowed.");

            if (cvFile.Length > 5 * 1024 * 1024)
                return BadRequest("CV file must be under 5MB.");

            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "cvs");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{userId}_{Guid.NewGuid()}{Path.GetExtension(cvFile.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await cvFile.CopyToAsync(stream);

            cvFilePath = $"/uploads/cvs/{fileName}";
        }

        var application = new JobApplication
        {
            JobId = dto.JobId,
            ApplicantId = userId,
            CoverLetter = dto.CoverLetter,
            CvFilePath = cvFilePath,
            Status = ApplicationStatus.Applied
        };

        _context.JobApplications.Add(application);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMyApplications), new { }, new ApplicationResponseDto
        {
            Id = application.Id,
            JobId = application.JobId,
            JobTitle = job.Title,
            Company = job.Company,
            ApplicantId = application.ApplicantId,
            CoverLetter = application.CoverLetter,
            CvFilePath = application.CvFilePath,
            Status = application.Status.ToString(),
            AppliedAt = application.AppliedAt,
            UpdatedAt = application.UpdatedAt
        });
    }

    // GET: api/applications/mine — seeker views their own applications
    [HttpGet("mine")]
    [Authorize(Roles = "JobSeeker")]
    public async Task<IActionResult> GetMyApplications()
    {
        var userId = GetUserId();

        var applications = await _context.JobApplications
            .Where(a => a.ApplicantId == userId)
            .Include(a => a.Job)
            .OrderByDescending(a => a.AppliedAt)
            .Select(a => new ApplicationResponseDto
            {
                Id = a.Id,
                JobId = a.JobId,
                JobTitle = a.Job.Title,
                Company = a.Job.Company,
                ApplicantId = a.ApplicantId,
                CoverLetter = a.CoverLetter,
                CvFilePath = a.CvFilePath,
                Status = a.Status.ToString(),
                AppliedAt = a.AppliedAt,
                UpdatedAt = a.UpdatedAt
            })
            .ToListAsync();

        return Ok(applications);
    }

    // GET: api/applications/job/{jobId} — employer views applicants for their job
    [HttpGet("job/{jobId}")]
    [Authorize(Roles = "Employer")]
    public async Task<IActionResult> GetJobApplications(int jobId)
    {
        var userId = GetUserId();

        // Verify the job belongs to this employer
        var job = await _context.Jobs
            .FirstOrDefaultAsync(j => j.Id == jobId && j.EmployerId == userId);

        if (job == null)
            return NotFound("Job not found or you don't have access.");

        var applications = await _context.JobApplications
            .Where(a => a.JobId == jobId)
            .Include(a => a.Applicant)
            .OrderByDescending(a => a.AppliedAt)
            .Select(a => new ApplicationResponseDto
            {
                Id = a.Id,
                JobId = a.JobId,
                JobTitle = job.Title,
                Company = job.Company,
                ApplicantId = a.ApplicantId,
                ApplicantName = a.Applicant.FirstName + " " + a.Applicant.LastName,
                ApplicantEmail = a.Applicant.Email!,
                CoverLetter = a.CoverLetter,
                CvFilePath = a.CvFilePath,
                Status = a.Status.ToString(),
                AppliedAt = a.AppliedAt,
                UpdatedAt = a.UpdatedAt
            })
            .ToListAsync();

        return Ok(applications);
    }

    // PUT: api/applications/{id}/status — employer updates application status
    [HttpPut("{id}/status")]
    [Authorize(Roles = "Employer")]
    public async Task<IActionResult> UpdateStatus(int id, UpdateApplicationStatusDto dto)
    {
        var userId = GetUserId();

        var application = await _context.JobApplications
            .Include(a => a.Job)
            .FirstOrDefaultAsync(a => a.Id == id && a.Job.EmployerId == userId);

        if (application == null)
            return NotFound();

        if (!Enum.TryParse<ApplicationStatus>(dto.Status, true, out var status))
            return BadRequest("Invalid status. Valid values: Applied, Reviewing, Interview, Offered, Rejected");

        application.Status = status;
        application.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
