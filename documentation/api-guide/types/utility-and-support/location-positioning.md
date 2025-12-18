<!-- (dl (section-meta Location and Positioning)) -->

These types handle source code locations, positioning, and coordinate tracking throughout the parsing and processing pipeline.

<!-- (dl (##ilocation-type `ILocation`)) -->

Core interface for source code location with comparison capabilities:

```typescript
interface ILocation extends IProjectLocation, ILocationCoordinates, IComparable<ILocation> {
    increaseLine(by?: number): ILocation;
    increaseChar(by?: number): ILocation;
}
```

**Key Features:**
- **Project context** - Document path, depth, and index information
- **Coordinate tracking** - Line and character position
- **Immutable operations** - `increaseLine` and `increaseChar` return new instances
- **Comparison support** - Implements `IComparable<ILocation>` for ordering

**Usage Pattern:**
```typescript
// Move location forward
let currentLocation = initialLocation;
currentLocation = currentLocation.increaseChar(5);
currentLocation = currentLocation.increaseLine(1);
```

<!-- (dl (##ilocation-coordinates-type `ILocationCoordinates`)) -->

Interface defining line and character positioning within a document:

```typescript
interface ILocationCoordinates extends IProjectLocation {
    readonly line: number;
    readonly char: number;
}
```

**Properties:**
- **Line number** - 1-based line position in source file
- **Character number** - 1-based character position within line
- **Project context** - Inherited document path and hierarchy information

<!-- (dl (##iproject-location-type `IProjectLocation`)) -->

Interface representing project-level location context:

```typescript
interface IProjectLocation {
    readonly documentPath: IPath;
    readonly documentDepth: number;
    readonly documentIndex: number;
}
```

**Properties:**
- **Document path** - Full path to the source file
- **Document depth** - Nesting level in include hierarchy (0 = root)
- **Document index** - Sequential index for processing order

**Usage:**
- **Error reporting** - Provides context for where errors occurred
- **Include hierarchy** - Tracks nested document relationships
- **Processing coordination** - Maintains order across multiple files

<!-- (dl (##irange-type `IRange`)) -->

Interface representing a range between two locations:

```typescript
interface IRange {
    readonly start: ILocationCoordinates;
    readonly end: ILocationCoordinates;
}
```

**Properties:**
- **Start position** - Beginning location of the range
- **End position** - Ending location of the range
- **Span definition** - Defines text or code spans within documents