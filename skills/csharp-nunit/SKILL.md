---
name: csharp-nunit
description: >
  NUnit test templates for Org .NET 8 services. Contains controller read/write/delete
  test patterns, service tests, and test data setup using Moq + MockQueryable.
  Used by @backend-tests when generating backend unit tests.
---

# NUnit Test Templates

> Templates use `{ServiceName}` and `{EntityName}` as placeholders.
> Replace with actual values from the codebase.

## Controller Read Tests

**File:** `ControllerTest/Common/{EntityName}ControllerTest/ReadFunctionTest.cs`

```csharp
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using System.Net;
using Org.{ServiceName}.Controllers.Common;
using Org.{ServiceName}.Test.Utility;

namespace Org.{ServiceName}.Test.ControllerTest.Common.{EntityName}ControllerTest;

[TestFixture]
public class ReadFunctionTest : {ServiceName}TestData
{
    private {EntityName}Controller _controller;

    [SetUp]
    public void Setup()
    {
        DoSetup();
        _controller = new {EntityName}Controller(
            MockContext.Object, {EntityName}Repo,
            {ServiceName}TestUtilities.GetMapper(),
            {ServiceName}TestUtilities.GetUnitOfWork(MockContext.Object))
        { ProblemDetailsFactory = new MockCustomProblemDetailFactory() };
    }

    [TearDown]
    public void TearDown() { _controller?.Dispose(); }

    [Test]
    public async Task GetAllAsync_DefaultCall_ReturnsStatusOKWith{EntityName}List()
    {
        InitializeMockSet();
        var result = await _controller.GetAllAsync().ConfigureAwait(false);
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        ObjectResult objectResult = (ObjectResult)result.Result;
        Assert.That((HttpStatusCode)objectResult.StatusCode == HttpStatusCode.OK);
        DTO.{EntityName}List items = (DTO.{EntityName}List)objectResult.Value;
        Assert.That(items, Is.Not.Null);
        Assert.That(items.{EntityName}s.Count, Is.EqualTo({EntityName}List.Count));
    }

    [Test]
    public async Task GetByIdAsync_ValidId_ReturnsStatusOKWith{EntityName}()
    {
        InitializeMockSet();
        var expected = {EntityName}List.First();
        var result = await _controller.GetByIdAsync(expected.{EntityName}Id).ConfigureAwait(false);
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        ObjectResult objectResult = (ObjectResult)result.Result;
        Assert.That((HttpStatusCode)objectResult.StatusCode == HttpStatusCode.OK);
        var item = (DTO.Master.Master{EntityName})objectResult.Value;
        Assert.That(item, Is.Not.Null);
        Assert.That(item.{EntityName}IdField == expected.{EntityName}Id);
    }

    [Test]
    public async Task GetByIdAsync_NonExistingId_ReturnsStatusNotFound()
    {
        InitializeMockSet();
        var result = await _controller.GetByIdAsync(99999).ConfigureAwait(false);
        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task GetAllAsync_WhenExceptionOccurs_ReturnsStatusInternalServerError()
    {
        // Setup mock to throw
        MockContext.Setup(x => x.Master{EntityName}).Throws(new Exception("DB Error"));
        var result = await _controller.GetAllAsync().ConfigureAwait(false);
        Assert.That(result.Result, Is.InstanceOf<ObjectResult>());
        ObjectResult objectResult = (ObjectResult)result.Result;
        Assert.That((HttpStatusCode)objectResult.StatusCode == HttpStatusCode.InternalServerError);
    }
}
```

## Controller Write Tests

**File:** `ControllerTest/Common/{EntityName}ControllerTest/WriteFunctionTest.cs`

```csharp
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using System.Net;
using Org.{ServiceName}.Controllers.Common;
using Org.{ServiceName}.Test.Utility;

namespace Org.{ServiceName}.Test.ControllerTest.Common.{EntityName}ControllerTest;

[TestFixture]
public class WriteFunctionTest : {ServiceName}TestData
{
    private {EntityName}Controller _controller;

    [SetUp]
    public void Setup()
    {
        DoSetup();
        _controller = new {EntityName}Controller(
            MockContext.Object, {EntityName}Repo,
            {ServiceName}TestUtilities.GetMapper(),
            {ServiceName}TestUtilities.GetUnitOfWork(MockContext.Object))
        { ProblemDetailsFactory = new MockCustomProblemDetailFactory() };
        // Set user identity for auth
        _controller.ControllerContext = {ServiceName}TestUtilities.GetControllerContext();
    }

    [TearDown]
    public void TearDown() { _controller?.Dispose(); }

    [Test]
    public async Task AddAsync_ValidNewEntity_ReturnsStatusOKWithCreatedEntity()
    {
        InitializeMockSet();
        var newItem = new DTO.Master.Master{EntityName} { NameField = "New {EntityName}" };
        var result = await _controller.AddAsync(newItem).ConfigureAwait(false);
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
    }

    [Test]
    public async Task AddAsync_DuplicateEntity_ReturnsStatusConflict()
    {
        InitializeMockSet();
        var duplicate = new DTO.Master.Master{EntityName} { NameField = {EntityName}List.First().Name };
        var result = await _controller.AddAsync(duplicate).ConfigureAwait(false);
        Assert.That(result.Result, Is.InstanceOf<ConflictObjectResult>());
    }

    [Test]
    public async Task UpdateAsync_ValidData_ReturnsStatusOKWithUpdatedEntity()
    {
        InitializeMockSet();
        var existing = {EntityName}List.First();
        var update = new DTO.Master.Master{EntityName}
        {
            {EntityName}IdField = existing.{EntityName}Id,
            NameField = "Updated Name"
        };
        var result = await _controller.UpdateAsync(update).ConfigureAwait(false);
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
    }

    [Test]
    public async Task UpdateAsync_NonExistingId_ReturnsStatusNotFound()
    {
        InitializeMockSet();
        var update = new DTO.Master.Master{EntityName} { {EntityName}IdField = 99999, NameField = "X" };
        var result = await _controller.UpdateAsync(update).ConfigureAwait(false);
        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }
}
```

## Controller Delete Tests

**File:** `ControllerTest/Common/{EntityName}ControllerTest/DeleteFunctionTest.cs`

```csharp
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using System.Net;
using Org.{ServiceName}.Controllers.Common;
using Org.{ServiceName}.Test.Utility;

namespace Org.{ServiceName}.Test.ControllerTest.Common.{EntityName}ControllerTest;

[TestFixture]
public class DeleteFunctionTest : {ServiceName}TestData
{
    private {EntityName}Controller _controller;

    [SetUp]
    public void Setup()
    {
        DoSetup();
        _controller = new {EntityName}Controller(
            MockContext.Object, {EntityName}Repo,
            {ServiceName}TestUtilities.GetMapper(),
            {ServiceName}TestUtilities.GetUnitOfWork(MockContext.Object))
        { ProblemDetailsFactory = new MockCustomProblemDetailFactory() };
        _controller.ControllerContext = {ServiceName}TestUtilities.GetControllerContext();
    }

    [TearDown]
    public void TearDown() { _controller?.Dispose(); }

    [Test]
    public async Task DeleteAsync_ValidId_ReturnsStatusOK()
    {
        InitializeMockSet();
        var existing = {EntityName}List.First();
        var result = await _controller.DeleteAsync(existing.{EntityName}Id).ConfigureAwait(false);
        Assert.That(result, Is.InstanceOf<OkObjectResult>());
    }

    [Test]
    public async Task DeleteAsync_NonExistingId_ReturnsStatusNotFound()
    {
        InitializeMockSet();
        var result = await _controller.DeleteAsync(99999).ConfigureAwait(false);
        Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
    }
}
```

## Service Test

**File:** `Domain/Services/Common/{EntityName}ServiceTest.cs`

```csharp
using AutoMapper;
using Moq;
using NUnit.Framework;
using System.Net;
using Org.{ServiceName}.Domain.Repository;
using Org.{ServiceName}.Domain.Services.Common;
using Org.{ServiceName}.Test.Utility;

namespace Org.{ServiceName}.Test.Domain.Services.Common;

[TestFixture]
public class {EntityName}ServiceTest : {ServiceName}TestData
{
    private {EntityName}Service _service;
    private Mock<{EntityName}Repository> _mockRepo;

    [SetUp]
    public void Setup()
    {
        DoSetup();
        _mockRepo = new Mock<{EntityName}Repository>(MockContext.Object);
        _service = new {EntityName}Service(
            _mockRepo.Object,
            {ServiceName}TestUtilities.GetMapper(),
            {ServiceName}TestUtilities.GetUnitOfWork(MockContext.Object));
    }

    [Test]
    public async Task GetAllAsync_ReturnsSuccess_WithMappedList()
    {
        _mockRepo.Setup(r => r.GetAllAsync())
            .ReturnsAsync(new BaseResponse<List<Master{EntityName}>>({EntityName}List));
        var result = await _service.GetAllAsync().ConfigureAwait(false);
        Assert.That(result.IsSuccessStatusCode(), Is.True);
        Assert.That(result.Resource.{EntityName}s.Count, Is.EqualTo({EntityName}List.Count));
    }

    [Test]
    public async Task GetByIdAsync_ValidId_ReturnsMappedMaster()
    {
        var expected = {EntityName}List.First();
        _mockRepo.Setup(r => r.GetByIdAsync(expected.{EntityName}Id))
            .ReturnsAsync(new BaseResponse<Master{EntityName}>(expected));
        var result = await _service.GetByIdAsync(expected.{EntityName}Id).ConfigureAwait(false);
        Assert.That(result.IsSuccessStatusCode(), Is.True);
        Assert.That(result.Resource.{EntityName}IdField, Is.EqualTo(expected.{EntityName}Id));
    }

    [Test]
    public async Task AddAsync_ValidEntity_ReturnsSuccessAndCallsComplete()
    {
        var entity = new Master{EntityName} { Name = "New" };
        _mockRepo.Setup(r => r.AddAsync(It.IsAny<Master{EntityName}>()))
            .ReturnsAsync(new BaseResponse<Master{EntityName}>(entity));
        var dto = new DTO.Master.Master{EntityName} { NameField = "New" };
        var result = await _service.AddAsync(dto, "test@test.com").ConfigureAwait(false);
        Assert.That(result.IsSuccessStatusCode(), Is.True);
    }
}
```

## Test Naming Convention

**Pattern:** `{MethodName}_{Scenario}_{ExpectedResult}`

Examples:
```
GetAllAsync_DefaultCall_ReturnsStatusOKWith{EntityName}List
GetByIdAsync_ValidId_ReturnsStatusOKWith{EntityName}
GetByIdAsync_NonExistingId_ReturnsStatusNotFound
AddAsync_ValidNewEntity_ReturnsStatusOKWithCreatedEntity
AddAsync_DuplicateEntity_ReturnsStatusConflict
UpdateAsync_ValidData_ReturnsStatusOKWithUpdatedEntity
UpdateAsync_NonExistingId_ReturnsStatusNotFound
DeleteAsync_ValidId_ReturnsStatusOK
DeleteAsync_NonExistingId_ReturnsStatusNotFound
GetAllAsync_WhenExceptionOccurs_ReturnsStatusInternalServerError
```
