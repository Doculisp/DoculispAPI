<!-- (dl (section-meta General Utilities)) -->

These types provide core utility functions and interfaces used throughout the API.

<!-- (dl (##iutil-type `IUtil`)) -->

Core utility interface providing result creation and location management:

```typescript
interface IUtil {
    ok<T>(successfulValue: T): ISuccess<T>;
    fail(step: ProcessingStep): (category: FailureCategory) => (message: string, documentPath?: IPath) => IFail;
    location(documentPath: IPath, documentDepth: number, documentIndex: number, line: number, char: number): ILocation;
    toLocation(projectLocation: IProjectLocation, line: number, char: number): ILocation;
    getProjectLocation(location: ILocation): IProjectLocation;
}
```

**Key Methods:**
- **`ok`** - Create success results with values
- **`fail`** - Curried function for creating failure results with context
- **`location`** - Create location objects from coordinates
- **`toLocation`** - Convert project location to full location
- **`getProjectLocation`** - Extract project context from location

**Usage Pattern:**
```typescript
// Create success result
const success = util.ok(processedData);

// Create failure result with context
const failure = util.fail('Document Parsing')('Parse Error')('Invalid syntax at line 5');

// Create location
const location = util.location(filePath, 0, 0, 5, 10);
```

<!-- (dl (##icomparable-type `IComparable<T>`)) -->

Generic interface for objects that can be compared and ordered:

```typescript
interface IComparable<T> {
    compare(other: T): IsOrder;
}
```

**Properties:**
- **Generic type** - Works with any comparable type
- **Order result** - Returns `IsBefore`, `IsSame`, or `IsAfter`
- **Sorting support** - Enables consistent ordering operations

<!-- (dl (##isorder-type `IsOrder`)) -->

Type representing comparison results for ordering:

```typescript
type IsOrder = IsBefore | IsSame | IsAfter;

// Where:
type IsBefore = -1;
type IsSame = 0;
type IsAfter = 1;
```

**Values:**
- **`IsBefore (-1)`** - First item comes before second
- **`IsSame (0)`** - Items are equal in ordering
- **`IsAfter (1)`** - First item comes after second

<!-- (dl (##iversion-type `IVersion`)) -->

Interface for accessing version information:

```typescript
interface IVersion {
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
    readonly versionString: string;
}
```

**Properties:**
- **Semantic versioning** - Major, minor, and patch numbers
- **String representation** - Complete version string (e.g., "1.2.3")
- **Version comparison** - Enables version checking and compatibility

**Usage:**
```typescript
const version = container.buildAs<IVersion>('version');
console.log(`API Version: ${version.versionString}`);
```

<!-- (dl (##location-builder-type `LocationBuilder`)) -->

Factory function type for creating location objects:

```typescript
type LocationBuilder = (line: number, char: number) => ILocation;
```

**Purpose:**
- **Location creation** - Generate location objects from coordinates
- **Context binding** - Pre-configured with document context
- **Simplified creation** - Reduced parameter count for common operations

<!-- (dl (##util-builder-type `UtilBuilder`)) -->

Factory function type for creating utility instances:

```typescript
type UtilBuilder = () => IUtil;
```

**Purpose:**
- **Utility instantiation** - Create new utility objects
- **Dependency injection** - Allow different utility implementations
- **Testing support** - Enable utility mocking and replacement