<!-- GENERATED DOCUMENT DO NOT EDIT! -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- Compiled with doculisp https://www.npmjs.com/package/doculisp -->
<!-- Written By: jason-kerney -->

# Doculisp API #

```
___  ____ ____ _  _ _    _ ____ ___     ___  ___  _
|  \ |  | |    |  | |    | [__  |__]   |__| |__] |
|__/ |__| |___ |__| |___ | ___] |      |  | |    |
```

A TypeScript API library for parsing and compiling Doculisp documents.

## Table of Contents ##

1. Section: [Why Doculisp?](#why-doculisp)
2. Section: [Get Started](#get-started)
3. Section: [API Usage](#api-usage)
4. Section: [Learn More](#learn-more)

## Why Doculisp? ##

### The Documentation Maintenance Problem ###

As developers, we've all been there: staring at a massive README file that's become unwieldy, outdated, and frankly intimidating to update. Traditional documentation approaches create several pain points:

- **Monolithic files** that are difficult to navigate and edit
- **Merge conflicts** when multiple contributors update different sections
- **Unclear change impact** when reviewing large file diffs
- **Context switching overhead** when editing unrelated documentation sections
- **Inconsistent structure** across different projects and teams

Doculisp solves these problems by bringing **modularity and structure** to markdown documentation.

### Why Developers Love Doculisp ###

#### 🎯 **Focused Editing** ####

Break your README into logical, manageable chunks. Need to update the installation instructions? Open just the `installation.md` file. Working on API documentation? Focus solely on `api.md`. No more scrolling through hundreds of lines to find the section you need.

#### 🔍 **Clear Change Tracking** ####

Git diffs become meaningful again. Instead of seeing "README.md changed 47 lines," you see exactly which conceptual sections were modified: `installation.md`, `troubleshooting.md`, etc.

#### 🤝 **Better Collaboration** ####

Multiple team members can work on different documentation sections simultaneously without merge conflicts. The documentation author editing the introduction won't conflict with the API maintainer updating endpoint documentation.

#### 📐 **Consistent Structure** ####

The `section-meta` blocks enforce consistent organization across all your documentation, making it easier for new team members to contribute and for users to find information.

#### ⚡ **Maintainability** ####

Small, focused files are easier to review, update, and refactor. When documentation grows, you can easily reorganize by moving files rather than cut-and-paste operations in large documents.

#### 🔄 **Effortless Restructuring** ####

Need to promote a section to its own document? Simply move the file and update the `include` block. What starts as a subsection can easily become a standalone document with its own table of contents and structure. No copy-paste, no broken links, no manual reorganization - just move files and update references.

#### 🔗 **Resilient Cross-References** ####

Every section and header can have a unique ID that enables dynamic linking within and across documents. Reference other sections with `(get-path id)` and Doculisp automatically generates the correct links. Best of all: when you restructure documentation and promote sections to standalone documents, as long as the IDs remain the same, all existing links continue to work seamlessly.

### Why Doculisp Over Other Options? ###

#### vs. Traditional Markdown ####

**Traditional approach**: One massive README.md file that becomes harder to manage over time.
**Doculisp advantage**: Modular files with structured includes, maintaining the simplicity of markdown while adding organization.

#### vs. Documentation Generators (GitBook, Docusaurus, etc.) ####

**Documentation generators**: Complex setup, learning curve, often overkill for project READMEs.
**Doculisp advantage**: Zero learning curve if you know markdown. Generates standard markdown files that work everywhere GitHub is supported.

#### vs. Wiki Systems ####

**Wiki systems**: Separate from your codebase, requires context switching, can become disconnected from code changes.
**Doculisp advantage**: Lives in your repository, versioned with your code, integrated into your development workflow.

#### vs. Raw File Splitting ####

**Manual file splitting**: No standard structure, inconsistent organization, manual assembly required.
**Doculisp advantage**: Structured metadata system, automated assembly, consistent patterns across projects.

### Getting Started: A Practical Approach ###

#### Start Simple, Grow Naturally ####

**Don't over-engineer from day one.** If your current README is manageable, keep it as-is. Doculisp shines when documentation becomes complex enough that modularization provides real value.

**Recommended progression:**
1. **Single file**: Start with a traditional README.md
2. **Natural breaking points**: When sections grow large (>50 lines) or become logically distinct, extract them
3. **Gradual adoption**: Begin with obvious candidates like installation instructions, API documentation, or troubleshooting guides
4. **Full structure**: Eventually organize into a complete Doculisp project when the benefits are clear

**Signs it's time to modularize:**
- Your README is over 200 lines
- Multiple people need to edit different sections
- You find yourself searching within the file to find specific content
- Merge conflicts are happening in documentation
- You're copying documentation patterns between projects

**Pro tip**: The goal is easier maintenance, not complexity. If splitting a small section into its own file makes editing *harder*, don't do it.

## Get Started ##

Get up and running with the Doculisp API in just 5 minutes!

### What is Doculisp? ###

Doculisp solves the **documentation maintenance problem**. Instead of managing one massive README file, you can break it into smaller, focused files that are easier to edit, review, and collaborate on.

**Before Doculisp:** One huge README.md file with merge conflicts
**After Doculisp:** Multiple small, focused files with clean collaboration

### API Quick Start ###

### 1. Install ###

```bash
npm install doculisp-api
```

### 2. Basic Usage ###

```typescript
import { DoculispApi } from 'doculisp-api';

// Initialize the API
const api = await DoculispApi.create();

// Compile a Doculisp file to markdown
const results = await api.compileFile('./docs/main.dlisp', './README.md');

// Check results
results.forEach(result => {
    if (result.success) {
        console.log(`✓ ${result.value}`);
    } else {
        console.error(`✗ ${result.message}`);
    }
});
```

### 3. Test/Validate Files ###

```typescript
// Test a file without writing output
const testResults = await api.testFile('./docs/main.dlisp');

testResults.forEach(result => {
    if (result.success) {
        console.log(`✓ Valid: ${result.value}`);
    } else {
        console.error(`✗ Error: ${result.message}`);
    }
});
```

### 4. Create Doculisp Files ###

**main.dlisp:**
```doculisp
(section-meta
    (title My Project)
    (include
        (Installation ./install.md)
        (Usage ./usage.md)
    )
)

(content (toc))
```

**install.md:**
````markdown
<!-- (dl (section-meta Installation)) -->

```bash
npm install my-project
```
````

**usage.md:**
````markdown
<!-- (dl (section-meta Usage)) -->

```javascript
const myProject = require('my-project');
myProject.run();
```
````

**Result:** Complete README with table of contents and combined sections programmatically generated.

### Next Steps ###

For comprehensive tutorials, examples, and best practices, see the [API Guide](./API_GUIDE.md).

## API Usage ##

### Installation ###

Install the Doculisp API library in your TypeScript/JavaScript project:

```bash
npm install doculisp-api
```

### Basic Usage ###

```typescript
import { DoculispApi } from 'doculisp-api';

// Initialize the API
const api = await DoculispApi.create();

// Compile a single Doculisp file
const results = await api.compileFile('./docs/source.dlisp', './output.md');

// Test/validate without writing
const testResults = await api.testFile('./docs/source.dlisp');

// Handle results
results.forEach(result => {
    if (result.success) {
        console.log(`✓ ${result.value}`);
    } else {
        console.error(`✗ ${result.message}`);
    }
});
```

### Advanced Usage ###

Access lower-level components for custom processing:

```typescript
import { DoculispApi } from 'doculisp-api';

const api = await DoculispApi.create();

// Get individual components
const astBuilder = api.getAstBuilder();
const stringWriter = api.getStringWriter();
const pathConstructor = api.getPathConstructor();
const util = api.getUtil();

// Create custom variable tables
const variableTable = api.createVariableTable();

// Work with paths
const inputPath = pathConstructor('./docs/source.dlisp');
const outputPath = pathConstructor('./dist/output.md');

// Custom processing pipeline
const parseResult = astBuilder.parse(variableTable);
if (parseResult.success) {
    const writeResult = stringWriter.writeAst(util.ok(parseResult.value), variableTable);
    console.log(writeResult);
}
```

### Project Files ###

The API supports `.dlproj` project files for batch processing:

```typescript
// Compile an entire project
const projectResults = await api.compileFile('./docs/project.dlproj');

// Project files define multiple documents
// See the CLI documentation for .dlproj file format
```

### Error Handling ###

All API methods return `Result<T>` objects with success/failure information:

```typescript
const results = await api.compileFile('./source.dlisp', './output.md');

results.forEach(result => {
    if (result.success) {
        // result.value contains the success message or output path
        console.log(`Success: ${result.value}`);
    } else {
        // result.message contains error details
        // result.documentPath contains the file path with the error
        console.error(`Error in ${result.documentPath}: ${result.message}`);
    }
});
```

## Learn More ##

* [API Guide](./API_GUIDE.md) - Complete guide with tutorials and best practices
* [Language Documentation](./LANG.md) - Language syntax reference
* [Project File Format](./PROJECT.md) - Multi-document compilation

<!-- Written By: jason-kerney -->
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- GENERATED DOCUMENT DO NOT EDIT! -->