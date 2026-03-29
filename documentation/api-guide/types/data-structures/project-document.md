<!-- (dl (section-meta Project and Document Types)) -->

These types represent project-level structures and raw document parsing results.

<!-- (dl (##project-document-type `IProjectDocument`)) -->

Represents a single document definition within a project:

```typescript
interface IProjectDocument {
    id?: string | undefined;
    sourcePath: IPath;
    destinationPath: IPath;
    location: ILocation;
    type: 'project-document';
    blockRange: IRange;
}
```

**Properties:**
- **ID** - Optional identifier for cross-referencing
- **Source path** - Input Doculisp file location
- **Destination path** - Target markdown file destination  
- **Location** - Position in project file for error reporting
- **Type discriminator** - `'project-document'`
- **Block range** - Source range information

<!-- (dl (##project-documents-type `IProjectDocuments`)) -->

Container for multiple document definitions in a project:

```typescript
interface IProjectDocuments {
    documents: IProjectDocument[];
    location: ILocation;
    type: 'project-documents';
    blockRange: IRange;
}
```

**Key Features:**
- **Document array** - All documents defined in the project
- **Batch processing** - Enables compilation of multiple documents
- **Location** - Position information for project-level operations
- **Type discriminator** - `'project-documents'`
- **Block range** - Source range information

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