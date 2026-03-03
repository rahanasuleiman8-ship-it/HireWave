using System.Security.Claims;
using HireWave.API.Data;
using HireWave.API.DTOs;
using HireWave.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HireWave.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobsController : ControllerBase
{
    private readonly AppDbContext _context;

    public JobsController(AppDbContext context)
    {
        _context = context;
    }

    private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub")!;

    // GET: api/jobs — public, no auth required
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var jobs = await _context.Jobs
            .Where(j => j.IsActive)
            .Include(j => j.Employer)
            .OrderByDescending(j => j.PostedAt)
            .Select(j => new JobResponseDto
            {
                Id = j.Id,
                Title = j.Title,
                Description = j.Description,
                Company = j.Company,
                Location = j.Location,
                SalaryMin = j.SalaryMin,
                SalaryMax = j.SalaryMax,
                JobType = j.JobType.ToString(),
                IsActive = j.IsActive,
                PostedAt = j.PostedAt,
                EmployerId = j.EmployerId,
                EmployerName = j.Employer.FirstName + " " + j.Employer.LastName
            })
            .ToListAsync();

        return Ok(jobs);
    }

    // GET: api/jobs/{id} — public
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var job = await _context.Jobs
            .Include(j => j.Employer)
            .Where(j => j.Id == id)
            .Select(j => new JobResponseDto
            {
                Id = j.Id,
                Title = j.Title,
                Description = j.Description,
                Company = j.Company,
                Location = j.Location,
                SalaryMin = j.SalaryMin,
                SalaryMax = j.SalaryMax,
                JobType = j.JobType.ToString(),
                IsActive = j.IsActive,
                PostedAt = j.PostedAt,
                EmployerId = j.EmployerId,
                EmployerName = j.Employer.FirstName + " " + j.Employer.LastName
            })
            .FirstOrDefaultAsync();

        if (job == null)
            return NotFound();

        return Ok(job);
    }

    // GET: api/jobs/mine — employer only
    [HttpGet("mine")]
    [Authorize(Roles = "Employer")]
    public async Task<IActionResult> GetMyJobs()
    {
        var userId = GetUserId();

        var jobs = await _context.Jobs
            .Where(j => j.EmployerId == userId)
            .OrderByDescending(j => j.PostedAt)
            .Select(j => new JobResponseDto
            {
                Id = j.Id,
                Title = j.Title,
                Description = j.Description,
                Company = j.Company,
                Location = j.Location,
                SalaryMin = j.SalaryMin,
                SalaryMax = j.SalaryMax,
                JobType = j.JobType.ToString(),
                IsActive = j.IsActive,
                PostedAt = j.PostedAt,
                EmployerId = j.EmployerId,
                EmployerName = ""
            })
            .ToListAsync();

        return Ok(jobs);
    }

    // POST: api/jobs — employer only
    [HttpPost]
    [Authorize(Roles = "Employer")]
    public async Task<IActionResult> Create(CreateJobDto dto)
    {
        var userId = GetUserId();

        var job = new Job
        {
            Title = dto.Title,
            Description = dto.Description,
            Company = dto.Company,
            Location = dto.Location,
            SalaryMin = dto.SalaryMin,
            SalaryMax = dto.SalaryMax,
            JobType = dto.JobType,
            EmployerId = userId
        };

        _context.Jobs.Add(job);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = job.Id }, new JobResponseDto
        {
            Id = job.Id,
            Title = job.Title,
            Description = job.Description,
            Company = job.Company,
            Location = job.Location,
            SalaryMin = job.SalaryMin,
            SalaryMax = job.SalaryMax,
            JobType = job.JobType.ToString(),
            IsActive = job.IsActive,
            PostedAt = job.PostedAt,
            EmployerId = job.EmployerId
        });
    }

    // PUT: api/jobs/{id} — employer only
    [HttpPut("{id}")]
    [Authorize(Roles = "Employer")]
    public async Task<IActionResult> Update(int id, UpdateJobDto dto)
    {
        var userId = GetUserId();

        var job = await _context.Jobs
            .FirstOrDefaultAsync(j => j.Id == id && j.EmployerId == userId);

        if (job == null)
            return NotFound();

        if (dto.Title != null) job.Title = dto.Title;
        if (dto.Description != null) job.Description = dto.Description;
        if (dto.Company != null) job.Company = dto.Company;
        if (dto.Location != null) job.Location = dto.Location;
        if (dto.SalaryMin != null) job.SalaryMin = dto.SalaryMin;
        if (dto.SalaryMax != null) job.SalaryMax = dto.SalaryMax;
        if (dto.JobType != null) job.JobType = dto.JobType.Value;
        if (dto.IsActive != null) job.IsActive = dto.IsActive.Value;
        job.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/jobs/{id} — employer only
    [HttpDelete("{id}")]
    [Authorize(Roles = "Employer")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();

        var job = await _context.Jobs
            .FirstOrDefaultAsync(j => j.Id == id && j.EmployerId == userId);

        if (job == null)
            return NotFound();

        _context.Jobs.Remove(job);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
