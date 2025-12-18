<!-- (dl (section-meta Project and Document Types)) -->

These types represent project-level structures and raw document parsing results.

<!-- (dl (##document-type `IDocument`)) -->

Represents a single document definition within a project:

```typescript
interface IDocument {
    readonly source: IPath;
    readonly output: IPath;
    readonly location: ILocation;
}
```

**Properties:**
- **Source path** - Input Doculisp file location
- **Output path** - Target markdown file destination  
- **Location context** - Position in project file for error reporting

<!-- (dl (##project-type `IProject`)) -->

Container for multiple document definitions in a project:

```typescript
interface IProject {
    readonly documents: IDocument[];
    readonly projectLocation: IProjectLocation;
}
```

**Key Features:**
- **Document array** - All documents defined in the project
- **Batch processing** - Enables compilation of multiple documents
- **Project context** - Location information for project-level operations

<!-- (dl (##document-map-type `DocumentMap`)) -->

Parsed document structure containing both text and Doculisp parts:

```typescript
interface DocumentMap {
    readonly parts: DocumentPart[];
    readonly projectLocation: IProjectLocation;
}
```

**Properties:**
- **Document parts** - Sequential text and Lisp content blocks
- **Mixed content** - Supports documents with embedded Doculisp
- **Location tracking** - Project position for error context

<!-- (dl (##document-part-type `DocumentPart`)) -->

Union type representing content blocks within a document:

```typescript
type DocumentPart = IText | ILispBlock;
```

**Component Types:**
- **`IText`** - Regular markdown/text content
- **`ILispBlock`** - Doculisp code blocks for processing

**Usage Pattern:**
```typescript
// Process mixed content
documentMap.parts.forEach(part => {
    if (part.type === 'text') {
        // Handle regular text content
        processText(part.content);
    } else {
        // Handle Doculisp code blocks
        processLisp(part.lispContent);
    }
});
```