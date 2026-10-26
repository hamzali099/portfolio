namespace Portfolio.Web.Models;

public record Profile
{
    public string Name { get; init; } = "";
    public string Title { get; init; } = "";
    public string Headline { get; init; } = "";
    public string Location { get; init; } = "";
    public string Email { get; init; } = "";
    public string LinkedIn { get; init; } = "";
    public string Summary { get; init; } = "";
    public List<string> TopSkills { get; init; } = new();
    public List<SkillGroup> SkillGroups { get; init; } = new();
    public List<Experience> Experience { get; init; } = new();
    public List<Education> Education { get; init; } = new();
    public List<Highlight> Highlights { get; init; } = new();
    public List<string> Roles { get; init; } = new();
    public List<Stat> Stats { get; init; } = new();
    public List<Project> Projects { get; init; } = new();
}

public record SkillGroup(string Category, List<string> Skills, string? Icon);

public record Experience(
    string Company,
    string Role,
    string Start,
    string? End,
    string Location,
    List<string> Points);

public record Education(
    string Institution,
    string Degree,
    string Field,
    string Start,
    string End,
    string? Location);

public record Highlight(string Title, string Description, string Icon);

public record Stat(string Value, string Label);

public record Project(
    string Title,
    string Category,
    string Description,
    List<string> Tech,
    List<string> Features,
    string? Github,
    string? Demo,
    bool Featured,
    string? Period);
