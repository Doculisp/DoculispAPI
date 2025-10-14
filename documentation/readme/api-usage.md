<!-- (dl
(section-meta
  (title API Usage)
  (id api-usage)
)
) -->

<!-- (dl (#api-install Installation)) -->

Install the Doculisp API library in your TypeScript/JavaScript project:

```bash
npm install doculisp-api
```

<!-- (dl (#api-basic Basic Usage)) -->

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

<!-- (dl (#api-advanced Advanced Usage)) -->

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

<!-- (dl (#api-project Project Files)) -->

The API supports `.dlproj` project files for batch processing:

```typescript
// Compile an entire project
const projectResults = await api.compileFile('./docs/project.dlproj');

// Project files define multiple documents
// See the CLI documentation for .dlproj file format
```

<!-- (dl (#api-error Error Handling)) -->

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
