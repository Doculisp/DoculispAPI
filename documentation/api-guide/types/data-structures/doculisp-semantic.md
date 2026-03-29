<!-- (dl (section-meta Doculisp Semantic Types)) -->

These types represent the semantic structure of Doculisp documents after AST processing, providing meaning to the parsed syntax.

<!-- (dl (##doculisp-part-type `DoculispPart`)) -->

Union type representing all semantic elements in a Doculisp document:

```typescript
type DoculispPart = IWrite | ITitle | ITableOfContents | IContentLocation | IHeader | IPathId;
```

**Component Types:**
- **`IWrite`** - Text content to be written to output
- **`ITitle`** - Document or section titles
- **`ITableOfContents`** - Table of contents configuration
- **`IContentLocation`** - Content placement markers
- **`IHeader`** - Dynamic heading elements
- **`IPathId`** - Path reference identifiers

<!-- (dl (##doculisp-type `IDoculisp`)) -->

Complete Doculisp document structure containing all semantic parts:

```typescript
interface IDoculisp {
    projectLocation: IProjectLocation;
    section: ISectionWriter;
    type: 'doculisp-root';
}
```

**Key Features:**
- **Section structure** - Contains the ISectionWriter with all document content
- **Location context** - Project-level positioning for error handling
- **Type discriminator** - Identifies this as a root Doculisp document

<!-- (dl (##section-writer-type `ISectionWriter`)) -->

Section structure with complete include hierarchy:

```typescript
interface ISectionWriter extends ILocationSortable {
    readonly doculisp: DoculispPart[];
    readonly include: ILoad[];
    readonly type: 'doculisp-section';
}
```

**Properties:**
- **Doculisp parts** - All semantic elements in this section
- **Include array** - External document dependencies (ILoad objects)
- **Type discriminator** - Identifies this as a section structure
- **Document order** - Location information from ILocationSortable

<!-- (dl (##toc-style-type `TocStyle`)) -->

Enumeration defining table of contents formatting options:

```typescript
type TocStyle = 
    | 'no-table'
    | 'unlabeled'
    | 'labeled'
    | 'numbered'
    | 'numbered-labeled'
    | 'bulleted'
    | 'bulleted-labeled';
```

**Style Options:**
- **`no-table`** - No table of contents generated
- **`unlabeled`** - TOC without section names
- **`labeled`** - Section names only
- **`numbered`** - Numbered entries only
- **`numbered-labeled`** - Numbers with section names
- **`bulleted`** - Bullet points only
- **`bulleted-labeled`** - Bullets with section names

<!-- (dl (##iwrite-type `IWrite`)) -->

Text content element to be written to output:

```typescript
interface IWrite extends ILocationSortable {
    readonly type: 'doculisp-write';
    readonly value: string;
}
```

**Properties:**
- **Type discriminator** - `'doculisp-write'`
- **Value** - Text content to output
- **Document order** - Location from ILocationSortable

<!-- (dl (##ititle-type `ITitle`)) -->

Document or section title element:

```typescript
interface ITitle extends ILocationSortable {
    readonly type: 'doculisp-title';
    readonly title: string;
    readonly label: string;
    readonly id?: string | undefined;
    readonly ref_link: string;
    readonly subtitle?: string | undefined;
}
```

**Properties:**
- **Type discriminator** - `'doculisp-title'`
- **Title** - Main title text
- **Label** - Title label for references
- **ID** - Optional identifier
- **Ref link** - Reference link text
- **Subtitle** - Optional subtitle

<!-- (dl (##itable-of-contents-type `ITableOfContents`)) -->

Table of contents configuration element:

```typescript
interface ITableOfContents extends ILocationSortable {
    readonly type: 'doculisp-toc';
    readonly label: string | false;
    readonly bulletStyle: DoculispBulletStyle;
}
```

**Properties:**
- **Type discriminator** - `'doculisp-toc'` (not `'table-of-contents'`)
- **Label** - TOC heading label or false for no label
- **Bullet style** - One of the DoculispBulletStyle options

<!-- (dl (##icontent-location-type `IContentLocation`)) -->

Marker for where included content should appear:

```typescript
interface IContentLocation extends ILocationSortable {
    readonly type: 'doculisp-content';
    readonly blockRange: IRange;
}
```

**Properties:**
- **Type discriminator** - `'doculisp-content'` (not `'content-location'`)
- **Block range** - Source range information

<!-- (dl (##iheader-type `IHeader`)) -->

Dynamic heading element with context-aware levels:

```typescript
interface IHeader extends ILocationSortable {
    readonly type: 'doculisp-header';
    readonly depthCount: number;
    readonly text: string;
    readonly id?: string | undefined;
}
```

**Properties:**
- **Type discriminator** - `'doculisp-header'`
- **Depth count** - Heading level depth
- **Text** - Heading text content
- **ID** - Optional identifier for cross-referencing

<!-- (dl (##ipath-id-type `IPathId`)) -->

Path reference identifier for cross-linking:

```typescript
interface IPathId extends ILocationSortable {
    readonly type: 'doculisp-path-id';
    readonly id: string;
    readonly blockRange: IRange;
}
```

**Properties:**
- **Type discriminator** - `'doculisp-path-id'`
- **ID** - Identifier for path reference
- **Block range** - Source range information

<!-- (dl (##iload-type `ILoad`)) -->

External document include specification:

```typescript
interface ILoad extends ILocationSortable {
    readonly type: 'doculisp-load';
    readonly path: IPath;
    readonly sectionLabel: string;
    document: ISectionWriter | false;
    blockRange: IRange;
}
```

**Properties:**
- **Type discriminator** - `'doculisp-load'`
- **Path** - Path to external document
- **Section label** - Label for the included section
- **Document** - Resolved ISectionWriter or false if not yet loaded
- **Block range** - Source range information