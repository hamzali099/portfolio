using Microsoft.EntityFrameworkCore;
using Portfolio.Web.Models;

namespace Portfolio.Web.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Feedback> Feedback => Set<Feedback>();
    public DbSet<ContactRecord> ContactMessages => Set<ContactRecord>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Feedback>().HasIndex(f => f.CreatedAt);

        // SQLite can't order by DateTimeOffset natively; store it as UTC ticks there
        if (Database.IsSqlite())
        {
            modelBuilder.Entity<Feedback>().Property(f => f.CreatedAt)
                .HasConversion(v => v.UtcTicks, v => new DateTimeOffset(v, TimeSpan.Zero));
            modelBuilder.Entity<ContactRecord>().Property(c => c.CreatedAt)
                .HasConversion(v => v.UtcTicks, v => new DateTimeOffset(v, TimeSpan.Zero));
        }
    }
}
