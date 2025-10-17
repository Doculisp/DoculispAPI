<!-- (dl (section-meta Get Started)) -->

Get up and running with the Doculisp API in just 5 minutes! 

<!-- (dl (# What is Doculisp?)) -->

Doculisp solves the **documentation maintenance problem**. Instead of managing one massive README file, you can break it into smaller, focused files that are easier to edit, review, and collaborate on.

**Before Doculisp:** One huge README.md file with merge conflicts  
**After Doculisp:** Multiple small, focused files with clean collaboration

<!-- (dl (# API Quick Start)) -->

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

<!-- (dl (# Next Steps)) -->

For comprehensive tutorials, examples, and best practices, see the [API Guide](<!-- (dl (get-path api-guide)) -->).