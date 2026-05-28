---
name: dotnet-crud-scaffold
description: >
  Complete CRUD code templates for Org .NET 8 services using ServiceBase patterns.
  Contains DTO, Mapping, Repository, Service, Controller, Startup, and Constants templates.
  Used by @backend when generating new entities.
---

# Backend CRUD Templates

> **Template Inventory** — all templates use `{ServiceName}` and `{EntityName}` as placeholders.
> Replace with actual values detected from the codebase before generating code.

## 1. DTO — Master Entity (Full Detail)

**File:** `DTO/Master/Master{EntityName}.cs`

```csharp
using Org.Base.Utilities.InterfaceUtilities;
using System.ComponentModel.DataAnnotations;

namespace Org.{ServiceName}.DTO.Master;

/// <summary>
/// Master DTO for {EntityName} entity with full detail.
/// </summary>
public class Master{EntityName}
{
    /// <summary>
    /// Initializes a new instance of <see cref="Master{EntityName}"/>.
    /// </summary>
    public Master{EntityName}()
    {
        InterfaceInfo = new InterfaceInfo
        {
            EntityType = "{EntityName}"
        };
    }

    /// <summary>Gets the interface information.</summary>
    public InterfaceInfo InterfaceInfo { get; }

    /// <summary>Gets or sets the {EntityName} identifier.</summary>
    [Required]
    public int {EntityName}IdField { get; set; }

    /// <summary>Gets or sets the name.</summary>
    [StringLength(240)]
    public string NameField { get; set; }

    /// <summary>Gets or sets the modified timestamp.</summary>
    public DateTime? ModifiedField { get; set; }

    // Add navigation sub-data properties as needed:
    // public ICollection<Master{Related}> Master{Related}Subdata { get; set; }
}
```

## 2. DTO — Summary (Flat, for lists)

**File:** `DTO/{EntityName}Summary.cs`

```csharp
namespace Org.{ServiceName}.DTO;

/// <summary>Lightweight summary DTO for {EntityName}.</summary>
public class {EntityName}Summary
{
    public int {EntityName}Id { get; set; }
    public string Name { get; set; }
    public bool IsActive { get; set; }
}
```

## 3. DTO — List Wrapper

**File:** `DTO/{EntityName}List.cs`

```csharp
namespace Org.{ServiceName}.DTO;

/// <summary>Contains a collection of <see cref="{EntityName}Summary"/> items.</summary>
public class {EntityName}List
{
    public {EntityName}List()
    {
        {EntityName}s = new HashSet<{EntityName}Summary>();
    }

    public ICollection<{EntityName}Summary> {EntityName}s { get; set; }
}
```

## 4. AutoMapper — MappingProfile Entry

**ADD to:** `Domain/Mapping/MappingProfile.cs` inside `MappingProfile()` constructor

```csharp
// {EntityName} mappings — Master DTO ↔ Entity (with Field suffix conversion)
CreateMap<DTO.Master.Master{EntityName}, {ServiceName}DB.Domain.Models.Master.Master{EntityName}>()
    .ForMember(dest => dest.{EntityName}Id, act => act.MapFrom(src => src.{EntityName}IdField))
    .ForMember(dest => dest.Name, act => act.MapFrom(src => src.NameField))
    .ForMember(dest => dest.Modified, act => act.MapFrom(src => src.ModifiedField))
    .ReverseMap();

// Entity → Summary DTO (flat)
CreateMap<{ServiceName}DB.Domain.Models.Master.Master{EntityName}, DTO.{EntityName}Summary>()
    .ForMember(dest => dest.{EntityName}Id, act => act.MapFrom(src => src.{EntityName}Id))
    .ForMember(dest => dest.Name, act => act.MapFrom(src => src.Name))
    .ReverseMap();
```

## 5. Repository

**File:** `Domain/Repository/{EntityName}Repository.cs`

```csharp
using Org.Base.Logging;
using Org.Base.Utilities.ResponseUtilities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using {ServiceName}DB.Domain.Models.Master;

namespace Org.{ServiceName}.Domain.Repository;

/// <summary>Repository for <see cref="Master{EntityName}"/> data access.</summary>
public class {EntityName}Repository : {ServiceName}BaseRepository<Master{EntityName}>
{
    public {EntityName}Repository({ServiceName}DBContext context) : base(context) { }

    public async Task<BaseResponse<List<Master{EntityName}>>> GetAllAsync()
    {
        try
        {
            var items = await GetContext().Master{EntityName}
                .AsNoTracking().ToListAsync().ConfigureAwait(false);
            return new BaseResponse<List<Master{EntityName}>>(items);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex);
            return new BaseResponse<List<Master{EntityName}>>(
                {ServiceName}Constants.FailedToLoad{EntityName}List, StatusCodes.Status500InternalServerError);
        }
    }

    public async Task<BaseResponse<Master{EntityName}>> GetByIdAsync(int {entityName}Id)
    {
        try
        {
            var item = await GetContext().Master{EntityName}
                .FirstOrDefaultAsync(x => x.{EntityName}Id == {entityName}Id).ConfigureAwait(false);
            if (item == null)
                return new BaseResponse<Master{EntityName}>({ServiceName}Constants.{EntityName}NotFound, StatusCodes.Status404NotFound);
            return new BaseResponse<Master{EntityName}>(item);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex);
            return new BaseResponse<Master{EntityName}>(
                {ServiceName}Constants.FailedToLoad{EntityName}, StatusCodes.Status500InternalServerError);
        }
    }

    public async Task<BaseResponse<Master{EntityName}>> AddAsync(Master{EntityName} {entityName})
    {
        try
        {
            var exists = GetContext().Master{EntityName}.Any(x => x.Name == {entityName}.Name);
            if (exists)
                return new BaseResponse<Master{EntityName}>({ServiceName}Constants.{EntityName}AlreadyExists, StatusCodes.Status409Conflict);
            await GetContext().Master{EntityName}.AddAsync({entityName}).ConfigureAwait(false);
            return new BaseResponse<Master{EntityName}>({entityName});
        }
        catch (Exception ex)
        {
            Logger.LogError(ex);
            return new BaseResponse<Master{EntityName}>(
                {ServiceName}Constants.FailedToCreate{EntityName}, StatusCodes.Status500InternalServerError);
        }
    }

    public async Task<BaseResponse<Master{EntityName}>> UpdateAsync(Master{EntityName} updated{EntityName})
    {
        try
        {
            var existing = await GetContext().Master{EntityName}
                .FirstOrDefaultAsync(x => x.{EntityName}Id == updated{EntityName}.{EntityName}Id).ConfigureAwait(false);
            if (existing == null)
                return new BaseResponse<Master{EntityName}>({ServiceName}Constants.{EntityName}NotFound, StatusCodes.Status404NotFound);
            GetContext().Entry(existing).CurrentValues.SetValues(updated{EntityName});
            return new BaseResponse<Master{EntityName}>(existing);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex);
            return new BaseResponse<Master{EntityName}>(
                {ServiceName}Constants.FailedToUpdate{EntityName}, StatusCodes.Status500InternalServerError);
        }
    }

    public async Task<BaseResponse> DeleteAsync(int {entityName}Id)
    {
        try
        {
            var existing = await GetContext().Master{EntityName}
                .FirstOrDefaultAsync(x => x.{EntityName}Id == {entityName}Id).ConfigureAwait(false);
            if (existing == null)
                return new BaseResponse({ServiceName}Constants.{EntityName}NotFound, StatusCodes.Status404NotFound);
            GetContext().Master{EntityName}.Remove(existing);
            return new BaseResponse(@"{EntityName} deleted", StatusCodes.Status200OK);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex);
            return new BaseResponse({ServiceName}Constants.FailedToDelete{EntityName}, StatusCodes.Status500InternalServerError);
        }
    }
}
```

## 6. Service — Full CRUD

**File:** `Domain/Services/Common/{EntityName}Service.cs`

```csharp
using AutoMapper;
using Org.Base.Logging;
using Org.Base.Utilities.ResponseUtilities;
using Microsoft.AspNetCore.Http;
using {ServiceName}DB.Domain.Models.Master;

namespace Org.{ServiceName}.Domain.Services.Common;

/// <summary>Service for {EntityName} business operations.</summary>
public class {EntityName}Service
{
    private readonly Repository.{EntityName}Repository _{entityName}Repository;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;

    public {EntityName}Service(
        Repository.{EntityName}Repository {entityName}Repository, IMapper mapper, IUnitOfWork unitOfWork)
    {
        _{entityName}Repository = {entityName}Repository ?? throw new ArgumentNullException(nameof({entityName}Repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
    }

    public async Task<BaseResponse<DTO.{EntityName}List>> GetAllAsync()
    {
        Logger.LogInformation(0, @"Get all {EntityName} process started");
        try
        {
            var response = await _{entityName}Repository.GetAllAsync().ConfigureAwait(false);
            if (!response.IsSuccessStatusCode())
                return new BaseResponse<DTO.{EntityName}List>(response.Message, response.StatusCode);
            var mapped = _mapper.Map<List<Master{EntityName}>, List<DTO.{EntityName}Summary>>(response.Resource);
            return new BaseResponse<DTO.{EntityName}List>(new DTO.{EntityName}List { {EntityName}s = mapped.ToHashSet() });
        }
        catch (Exception ex) { Logger.LogError(ex); return new BaseResponse<DTO.{EntityName}List>({ServiceName}Constants.FailedToLoad{EntityName}List, StatusCodes.Status500InternalServerError); }
        finally { Logger.LogInformation(0, @"Get all {EntityName} process completed"); }
    }

    public async Task<BaseResponse<DTO.Master.Master{EntityName}>> GetByIdAsync(int {entityName}Id)
    {
        Logger.LogInformation(0, @"Get {EntityName} by id process started");
        try
        {
            var response = await _{entityName}Repository.GetByIdAsync({entityName}Id).ConfigureAwait(false);
            if (!response.IsSuccessStatusCode())
                return new BaseResponse<DTO.Master.Master{EntityName}>(response.Message, response.StatusCode);
            return new BaseResponse<DTO.Master.Master{EntityName}>(_mapper.Map<Master{EntityName}, DTO.Master.Master{EntityName}>(response.Resource));
        }
        catch (Exception ex) { Logger.LogError(ex); return new BaseResponse<DTO.Master.Master{EntityName}>({ServiceName}Constants.FailedToLoad{EntityName}, StatusCodes.Status500InternalServerError); }
        finally { Logger.LogInformation(0, @"Get {EntityName} by id process completed"); }
    }

    public async Task<BaseResponse<DTO.Master.Master{EntityName}>> AddAsync(DTO.Master.Master{EntityName} {entityName}, string userEmail)
    {
        Logger.LogInformation(0, @"Add {EntityName} process started");
        try
        {
            var entity = _mapper.Map<DTO.Master.Master{EntityName}, Master{EntityName}>({entityName});
            var response = await _{entityName}Repository.AddAsync(entity).ConfigureAwait(false);
            if (response.IsSuccessStatusCode())
            {
                await _unitOfWork.CompleteAsync(userEmail).ConfigureAwait(false);
                return new BaseResponse<DTO.Master.Master{EntityName}>(_mapper.Map<Master{EntityName}, DTO.Master.Master{EntityName}>(response.Resource));
            }
            return new BaseResponse<DTO.Master.Master{EntityName}>(response.Message, response.StatusCode);
        }
        catch (Exception ex) { Logger.LogError(ex); return new BaseResponse<DTO.Master.Master{EntityName}>({ServiceName}Constants.FailedToCreate{EntityName}, StatusCodes.Status500InternalServerError); }
        finally { Logger.LogInformation(0, @"Add {EntityName} process completed"); }
    }

    public async Task<BaseResponse<DTO.Master.Master{EntityName}>> UpdateAsync(DTO.Master.Master{EntityName} {entityName}, string userEmail)
    {
        Logger.LogInformation(0, @"Update {EntityName} process started");
        try
        {
            var entity = _mapper.Map<DTO.Master.Master{EntityName}, Master{EntityName}>({entityName});
            var response = await _{entityName}Repository.UpdateAsync(entity).ConfigureAwait(false);
            if (response.IsSuccessStatusCode())
            {
                await _unitOfWork.CompleteAsync(userEmail).ConfigureAwait(false);
                return new BaseResponse<DTO.Master.Master{EntityName}>(_mapper.Map<Master{EntityName}, DTO.Master.Master{EntityName}>(response.Resource));
            }
            return new BaseResponse<DTO.Master.Master{EntityName}>(response.Message, response.StatusCode);
        }
        catch (Exception ex) { Logger.LogError(ex); return new BaseResponse<DTO.Master.Master{EntityName}>({ServiceName}Constants.FailedToUpdate{EntityName}, StatusCodes.Status500InternalServerError); }
        finally { Logger.LogInformation(0, @"Update {EntityName} process completed"); }
    }

    public async Task<BaseResponse> DeleteAsync(int {entityName}Id, string userEmail)
    {
        Logger.LogInformation(0, @"Delete {EntityName} process started");
        try
        {
            var response = await _{entityName}Repository.DeleteAsync({entityName}Id).ConfigureAwait(false);
            if (response.IsSuccessStatusCode())
                await _unitOfWork.CompleteAsync(userEmail).ConfigureAwait(false);
            return response;
        }
        catch (Exception ex) { Logger.LogError(ex); return new BaseResponse({ServiceName}Constants.FailedToDelete{EntityName}, StatusCodes.Status500InternalServerError); }
        finally { Logger.LogInformation(0, @"Delete {EntityName} process completed"); }
    }
}
```

## 7. Controller — Common (multi-version)

**File:** `Controllers/Common/{EntityName}Controller.cs`

```csharp
using Asp.Versioning;
using AutoMapper;
using Org.Base.Utilities.ResponseUtilities;
using Org.ServiceBase.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Org.{ServiceName}.Controllers.Common;

/// <summary>Controller for {EntityName} CRUD operations.</summary>
[ApiVersion("1.0")][ApiVersion("1.1")][ApiVersion("2.0")]
[Route("v{version:apiVersion}/{EntityName}s")]
[ApiController]
public class {EntityName}Controller : AuditorBaseController<DTO.Master.Master{EntityName}, {ServiceName}DB.Domain.Models.Master.Master{EntityName}>
{
    private readonly Domain.Services.Common.{EntityName}Service _{entityName}Service;

    public {EntityName}Controller(
        {ServiceName}DBContext context, Domain.Repository.{EntityName}Repository repository,
        IMapper mapper, IUnitOfWork unitOfWork) : base(context, mapper)
    {
        _{entityName}Service = new Domain.Services.Common.{EntityName}Service(repository, mapper, unitOfWork);
    }

    [HttpGet][Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<DTO.{EntityName}List>> GetAllAsync()
    {
        BaseResponse<DTO.{EntityName}List> response = await _{entityName}Service.GetAllAsync().ConfigureAwait(false);
        return ReplyBaseResponse(response);
    }

    [HttpGet("{{{entityName}Id}}")][Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<DTO.Master.Master{EntityName}>> GetByIdAsync(int {entityName}Id)
    {
        BaseResponse<DTO.Master.Master{EntityName}> response = await _{entityName}Service.GetByIdAsync({entityName}Id).ConfigureAwait(false);
        return ReplyBaseResponse(response);
    }

    [HttpPost][Consumes("application/json")][Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<DTO.Master.Master{EntityName}>> AddAsync([FromBody] DTO.Master.Master{EntityName} {entityName})
    {
        var emailId = AuthenticationBearer.GetEmail(User);
        BaseResponse<DTO.Master.Master{EntityName}> response = await _{entityName}Service.AddAsync({entityName}, emailId).ConfigureAwait(false);
        return ReplyBaseResponse(response);
    }

    [HttpPut][Consumes("application/json")][Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<DTO.Master.Master{EntityName}>> UpdateAsync([FromBody] DTO.Master.Master{EntityName} {entityName})
    {
        var emailId = AuthenticationBearer.GetEmail(User);
        BaseResponse<DTO.Master.Master{EntityName}> response = await _{entityName}Service.UpdateAsync({entityName}, emailId).ConfigureAwait(false);
        return ReplyBaseResponse(response);
    }

    [HttpDelete("{{{entityName}Id}}")][Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> DeleteAsync(int {entityName}Id)
    {
        var emailId = AuthenticationBearer.GetEmail(User);
        BaseResponse response = await _{entityName}Service.DeleteAsync({entityName}Id, emailId).ConfigureAwait(false);
        return ReplyBaseResponse(response);
    }
}
```

## 8. Controller — Versioned (inheriting)

**File:** `Controllers/v2_1/{EntityName}Controller.cs`

```csharp
using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace Org.{ServiceName}.Controllers.v2_1;

[ApiVersion("2.1")]
[Route("v{version:apiVersion}/{EntityName}s")]
[ApiController]
public class {EntityName}Controller : Common.{EntityName}Controller
{
    public {EntityName}Controller(
        {ServiceName}DBContext context, Domain.Repository.{EntityName}Repository repository,
        IMapper mapper, IUnitOfWork unitOfWork) : base(context, repository, mapper, unitOfWork) { }
}
```

## 9. Startup.cs Registration

**ADD to** `ConfigureServices()`:

```csharp
// {EntityName}
services.AddScoped<Domain.Repository.{EntityName}Repository>();
services.AddScoped<Domain.Services.Common.{EntityName}Service>();
```

## 10. Constants

**ADD to** `{ServiceName}Constants.cs`:

```csharp
// {EntityName}
public const string FailedToLoad{EntityName}List = @"Failed to load {EntityName} list";
public const string FailedToLoad{EntityName} = @"Failed to load {EntityName}";
public const string FailedToCreate{EntityName} = @"Failed to create {EntityName}";
public const string FailedToUpdate{EntityName} = @"Failed to update {EntityName}";
public const string FailedToDelete{EntityName} = @"Failed to delete {EntityName}";
public const string {EntityName}AlreadyExists = @"{EntityName} already exists";
public const string {EntityName}NotFound = @"{EntityName} not found";
```

## 11. Scaffold Mode — New Microservice

```bash
mkdir {ServiceName}.Service {ServiceName}.Test APITests
dotnet new sln -n {ServiceName}.Service
cd {ServiceName}.Service && dotnet new webapi -n {ServiceName}.Service --framework net8.0 && cd ..
dotnet sln add {ServiceName}.Service/{ServiceName}.Service.csproj
dotnet new nunit -n {ServiceName}.Test --framework net8.0
dotnet sln add {ServiceName}.Test/{ServiceName}.Test.csproj
cd {ServiceName}.Test && dotnet add reference ../{ServiceName}.Service/{ServiceName}.Service.csproj && cd ..
```

Folder layout:
```
{ServiceName}.Service/
├── Controllers/ (Common/, v1/, v2/)
├── Domain/ (IUnitOfWork.cs, {ServiceName}Constants.cs, Mapping/, Models/, Repository/, Services/, Utility/)
├── DTO/ (ConfigSync/, Master/, v2/)
├── Startup.cs, Program.cs, {ServiceName}ConfigurationKeys.cs
```
