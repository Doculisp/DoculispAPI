<!-- (dl (section-meta String Writer)) -->

The **String Writer** is the final output generation stage of the Doculisp processing pipeline, responsible for converting the complete, unified document structure into clean, standards-compliant markdown text.

<!-- (dl (## Core Purpose)) -->

The String Writer performs **markdown generation and output formatting**:

- **Markdown Generation** - Convert semantic Doculisp structures into proper markdown syntax
- **Content Formatting** - Apply consistent spacing, structure, and styling
- **Table of Contents Creation** - Generate TOC based on document configuration
- **Link Resolution** - Convert cross-references and path IDs into proper markdown links
- **Final Assembly** - Combine all elements into complete, ready-to-use markdown

This final stage transforms the **complete semantic document structure** into **clean, portable markdown** that works across all platforms and tools.

<!-- (dl (## Markdown Generation)) -->

The String Writer converts each type of [`DoculispPart`](<!-- (dl (get-path doculisp-part-type)) -->) into appropriate markdown output:

<!-- (dl (### Content Writing)) -->

**`IWrite` Elements** - Direct text content output:
```typescript
// Input: IWrite part
{ type: 'doculisp-write', value: 'This is documentation content.' }

// Output: Direct markdown
"This is documentation content."
```

<!-- (dl (### Title Generation)) -->

**`ITitle` Elements** - Document and section titles:
```typescript
// Input: ITitle part
{ type: 'doculisp-title', title: 'Getting Started', label: 'Getting Started' }

// Output: Markdown heading
"# Getting Started"
```

<!-- (dl (### Dynamic Headers)) -->

**`IHeader` Elements** - Context-aware headings with optional IDs:
```typescript
// Input: IHeader part
{ type: 'doculisp-header', depthCount: 2, text: 'Installation', id: 'install-guide' }

// Output: Markdown heading with anchor
"## Installation {#install-guide}"
```

<!-- (dl (### Table of Contents)) -->

**`ITableOfContents` Elements** - Generated TOC based on document structure:
```typescript
// Input: TOC configuration
{ type: 'doculisp-toc', bulletStyle: 'numbered-labeled', label: 'Contents' }

// Output: Generated TOC
"## Contents\n1. [Getting Started](#getting-started)\n2. [Installation](#installation)"
```

<!-- (dl (## Content Integration)) -->

The String Writer handles **complex content integration** from the complete document hierarchy:

<!-- (dl (### Include Content Placement)) -->

**`IContentLocation` Elements** - Mark where included content appears:
```typescript
// Included content is seamlessly integrated at doculisp-content markers
// Original: (content (toc numbered-labeled))
// Result: Complete TOC + all included content in proper order
```

<!-- (dl (### Cross-Reference Resolution)) -->

**`IPathId` Elements** - Resolve cross-document references:
```typescript
// Input: Path reference
{ type: 'path-id', id: 'installation-guide' }

// Output: Resolved markdown link
"[Installation Guide](#installation-guide)"
```

<!-- (dl (### Variable Substitution)) -->

The String Writer integrates with the variable system to resolve:
- **Source file context** - Current file information for relative paths
- **Working directory** - Base path for relative link resolution
- **Custom variables** - User-defined content substitutions

<!-- (dl (## Formatting and Styling)) -->

The String Writer applies **consistent formatting rules** for clean, readable output:

<!-- (dl (### Spacing Management)) -->

- **Consistent line breaks** - Proper spacing between sections and elements
- **Paragraph separation** - Clear distinction between content blocks
- **List formatting** - Proper indentation and spacing for TOC and other lists
- **Code block preservation** - Maintain formatting for code examples

<!-- (dl (### Content Structure)) -->

- **Heading hierarchy** - Ensure proper H1, H2, H3 progression
- **Section organization** - Logical flow from titles through content to includes
- **Metadata handling** - Include author information and document metadata appropriately

**Example Output Structure:**
```markdown
# Document Title

*Authors: Jason Kerney, GitHub Copilot*

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)

## Introduction
Content from introduction section...

## Getting Started
Content from getting started include...
```

<!-- (dl (## Writer Interface)) -->

The String Writer implements the [`IStringWriter`](<!-- (dl (get-path istring-writer-type)) -->) interface:

```typescript
interface IStringWriter {
    writeString(sectionWriter: ISectionWriter): Result<string>;
}
```

**Input:**
- **[`ISectionWriter`](<!-- (dl (get-path section-writer-type)) -->)** - Complete, unified document structure from Include Builder

**Output:**
- **[`Result<string>`](<!-- (dl (get-path result-type)) -->)** - Generated markdown text or detailed failure

<!-- (dl (### Processing Flow)) -->

The String Writer processes the complete document through these stages:

1. **Document Analysis** - Examine the complete structure and determine output requirements
2. **TOC Generation** - Create table of contents based on configuration and content
3. **Content Processing** - Convert each semantic element to appropriate markdown
4. **Link Resolution** - Resolve all cross-references and path IDs
5. **Final Assembly** - Combine all elements with proper formatting and spacing

<!-- (dl (## Table of Contents Generation)) -->

The String Writer generates **dynamic table of contents** based on document configuration:

<!-- (dl (### TOC Styles)) -->

The writer supports all [`TocStyle`](<!-- (dl (get-path toc-style-type)) -->) options:

- **`no-table`** - Skip TOC generation entirely
- **`unlabeled`** - TOC without section names (just links)
- **`labeled`** - Section names only
- **`numbered`** - Numbered entries only (1., 2., 3.)
- **`numbered-labeled`** - Numbers with section names (1. Getting Started)
- **`bulleted`** - Bullet points only (-, *, +)
- **`bulleted-labeled`** - Bullets with section names (- Getting Started)

<!-- (dl (### TOC Content Discovery)) -->

The writer analyzes the complete document structure to:
- **Extract headings** - Find all titles and headers for TOC entries
- **Generate anchors** - Create proper markdown anchor links
- **Calculate hierarchy** - Determine proper nesting and indentation
- **Apply styling** - Format according to specified TOC style

<!-- (dl (## Error Handling)) -->

The String Writer provides **comprehensive error handling** for output generation issues:

<!-- (dl (### Generation Errors)) -->

- **Invalid structure** - Malformed document elements that can't be converted
- **Link resolution failures** - Cross-references that can't be resolved
- **Formatting issues** - Problems with markdown generation or structure
- **Variable resolution errors** - Missing or invalid variables during substitution

**Generation Error Example:**
```typescript
{
    success: false,
    message: "Unable to resolve cross-reference ID 'missing-section' in link generation",
    documentPath: sourcePath,
    processingStep: "Building Document",
    failureCategory: "Validation Error"
}
```

<!-- (dl (### Output Validation)) -->

The writer validates generated output for:
- **Markdown compliance** - Ensure generated markdown follows standards
- **Link integrity** - Verify all links are properly formatted and resolvable
- **Structure consistency** - Check that heading levels and hierarchy are correct
- **Content completeness** - Ensure all semantic elements were properly converted

<!-- (dl (## Integration with Pipeline)) -->

The String Writer completes the **entire Doculisp processing pipeline**:

**Complete Workflow:**
1. **[Include Builder](<!-- (dl (get-path iinclude-builder-type)) -->)** - Orchestrates processing and assembles [`ISectionWriter`](<!-- (dl (get-path section-writer-type)) -->)
2. **[String Writer](<!-- (dl (get-path istring-writer-type)) -->)** - Converts to final markdown output
3. **File Operations** - Write generated markdown to target files

<!-- (dl (### Output Benefits)) -->

The String Writer produces **high-quality markdown** with several advantages:

- **Standards compliance** - Works with all markdown processors and platforms
- **Clean formatting** - Consistent, readable structure throughout
- **Complete cross-referencing** - All links and references properly resolved
- **Portable output** - Generated files work independently without Doculisp dependencies

<!-- (dl (### Generation Flexibility)) -->

The String Writer supports **flexible output generation**:

- **File output** - Write directly to specified files
- **String return** - Return generated markdown for further processing
- **Streaming support** - Handle large documents efficiently
- **Encoding management** - Proper UTF-8 and character encoding handling

The **String Writer** completes Doculisp's transformation of **modular, maintainable source documents** into **clean, portable markdown output** that preserves all the benefits of Doculisp's structured approach while producing standard markdown that works everywhere.