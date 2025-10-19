# AST Doculisp Test Reorganization Plan

## Overview

This plan provides a systematic approach to reorganize and rename the `astDoculisp.test.ts` file to follow modern testing conventions and improve maintainability. The reorganization will align with the AI Testing Codex principles while maintaining all existing functionality. This test file covers Doculisp AST parsing functionality that converts generic AST nodes into semantically meaningful Doculisp document structures, which is a critical component in the Doculisp processing pipeline.

## Prerequisites

**CRITICAL**: Before executing any step, the copilot MUST:
1. Read the **AI Testing Codex** (`.github/AI-Testing-Codex.md`) in full
2. Read the **AI Doculisp AST Parser Codex** (`.github/AI-Doculisp-AST-Parser-Codex.md`) for Doculisp semantic parsing understanding
3. Read the **AI Assistant Codex** (`.github/AI-Assistant-Codex.md`) for Doculisp syntax understanding
4. Read this complete plan document
5. Understand the commit message format from `.github/.copilot-instructions.md`

## Plan Execution Rules

1. **Step-by-step execution**: Complete each step individually and wait for confirmation before proceeding
2. **Test validation**: After each step, run tests. If tests pass, commit the changes. If tests fail, do NOT mark the step complete
3. **Plan updates**: Update this plan document after each completed step by marking it `[COMPLETED]`
4. **Approval file tracking**: Each step must include renaming all 70+ associated approval files to match new test names

## Jest Testing Requirements

**IMPORTANT**: All test commands in this plan use Jest directly via `npx jest` rather than `npm test`. This is because npm does not properly pass command-line arguments to Jest. 

**CRITICAL BUILD REQUIREMENT**: The Doculisp project uses a dependency injection container that auto-discovers modules from the `dist/` folder. **You MUST run `npm run build` before any test execution** or tests will fail due to missing compiled dependencies.

**Correct Commands:**
- Build and run specific test file: `npm run build && npx jest --testPathPattern=filename`
- Build and run all tests: `npm run build && npx jest`
- Build and run tests with watch mode: `npm run build && npx jest --watch`

**DO NOT USE:** `npm test -- --testPathPattern=filename` (this will not work correctly)

## Periodic Re-reading Requirements

**MANDATORY**: The copilot MUST re-read the following documents at these intervals:
1. **After every 2-3 test reorganizations**: Re-read this plan and the AI Testing Codex
2. **When summarizing the conversation**: Re-read this plan, AI Testing Codex, AI Doculisp AST Parser Codex, and any relevant AI Assistant Codex sections
3. **After any extended pause or context switch**: Re-read all prerequisite documents
4. **Before starting each major reorganization phase**: Re-read relevant sections of this plan
5. **When encountering uncertainty or inconsistency**: Stop and re-read the appropriate codex documents

## Current State Analysis

The current `astDoculisp.test.ts` has these issues:
- Non-descriptive main describe block using generic "astDoculisp" name
- Inconsistent test naming with mix of "should" and descriptive patterns
- Complex nested describe block structure that's difficult to navigate
- 70+ approval files using old naming conventions
- Test structure doesn't clearly separate different Doculisp document types or validation scenarios
- Heavy use of .each() parameterized tests that could be better organized
- Mixed variable table testing and approval testing patterns
- Limited use of AI Testing Codex patterns for dependency injection

**Current Test Structure:**
- **Basic Functionality**: 4 tests (basic parsing scenarios)
- **Lisp Processing**: 60+ tests organized in deeply nested describe blocks
  - **Header**: 5 tests (header parsing with ID validation)
  - **Section-meta**: 35+ tests (title, author, ref-link, subtitle, include, id validation)
  - **Content**: 20+ tests (content location and TOC configuration)
  - **Get-path**: 1 test (dynamic path resolution)
- **Error Handling**: 9 tests (various validation scenarios)

## Target State

After reorganization:
- Clear, descriptive test names following sentence structure with spaces
- Logical test grouping by Doculisp document functionality
- Consistent naming conventions following AI Testing Codex patterns
- Better describe block organization separating document structure types, validation scenarios, and error conditions
- All 70+ approval files correctly renamed
- Improved readability and maintainability
- Clear separation between basic parsing, document structure validation, and business logic testing

## Reorganization Steps

### Phase 1: Setup and Preparation

#### Step 1: Create Backup and Analyze Current Structure
- [ ] **[PENDING]** Create backup of current test file
- [ ] **[PENDING]** Document current approval files (70+ files)
- [ ] **[PENDING]** Map complex nested describe structure
- [ ] **[PENDING]** Commit backup with message: `". d Creates backup before AST Doculisp test reorganization"`

**Expected Outcomes**: 
- Backup file created
- Current state documented with nested structure mapping
- Safe starting point established

#### Step 2: Plan Test Name Mappings
- [ ] **[PENDING]** Create mapping document showing old test names → new test names
- [ ] **[PENDING]** Create mapping document showing old approval files → new approval files (70+ mappings)
- [ ] **[PENDING]** Plan describe block restructuring to reduce nesting complexity
- [ ] **[PENDING]** Validate no naming conflicts exist

**Expected Outcomes**:
- Complete rename mapping documented
- Describe block restructuring planned
- No conflicts identified
- Clear path forward established

### Phase 2: Core Test Structure Reorganization

#### Step 3: Reorganize Basic Doculisp Parsing Tests
- [ ] **[PENDING]** Rename 4 basic functionality tests under `describe('Basic Doculisp Parsing')`
- [ ] **[PENDING]** Group by subcategories: Empty Input, Error Propagation, Value Processing
- [ ] **[PENDING]** Use pattern: `{input type} {verb} {result}`
- [ ] **[PENDING]** Update associated approval files (4 files)
- [ ] **[PENDING]** Run tests and commit if passing

**Basic Parsing Tests to Rename**:
- `should return an empty doculisp if given empty ast` → `empty AST input produces empty Doculisp`
- `should return failure if given failure` → `failed AST parsing propagates error`
- `should parse a value` → `single value AST creates write node`
- `should parse multiple value ast elements` → `multiple value ASTs create write nodes`

**Expected Outcomes**:
- 4 basic Doculisp parsing tests renamed
- 4 approval files renamed
- Tests logically grouped
- Tests passing
- Commit created

#### Step 4: Reorganize Header Parsing Tests
- [ ] **[PENDING]** Rename 5 header tests under `describe('Header Parsing')`
- [ ] **[PENDING]** Group by subcategories: Simple Headers, ID Validation
- [ ] **[PENDING]** Use pattern: `{header type} {verb} {scenario}`
- [ ] **[PENDING]** Update associated approval files (5 files)
- [ ] **[PENDING]** Run tests and commit if passing

**Header Tests to Rename**:
- `should parse simple ast` → `simple header with parameter parses successfully`
- `should not parse a header without a parameter` → `header without parameter produces error`
- `should parse a header with an id` → `header with valid ID parses successfully`
- `should not parse a header with an id that contains uppercase letters` → `header with uppercase ID produces error`
- `should not parse a header with an id that contains a symbol` → `header with symbol ID produces error`

**Expected Outcomes**:
- 5 header parsing tests renamed
- 5 approval files renamed
- Tests logically grouped by functionality
- Tests passing
- Commit created

#### Step 5: Reorganize Section-Meta Parsing Tests
- [ ] **[PENDING]** Rename 35+ section-meta tests under `describe('Section-Meta Parsing')`
- [ ] **[PENDING]** Group by subcategories: General Structure, Title, Author, Ref-Link, Subtitle, Include, ID
- [ ] **[PENDING]** Use pattern: `{element type} {verb} {scenario}`
- [ ] **[PENDING]** Update associated approval files (35+ files)
- [ ] **[PENDING]** Run tests and commit if passing

**Section-Meta Tests Categories**:
- **General Structure**: Overall section-meta validation
- **Title Processing**: Title parsing and validation
- **Author Handling**: Author blocks and variable table integration
- **Ref-Link Generation**: Reference link creation and character stripping
- **Subtitle Processing**: Subtitle parsing and validation
- **Include Management**: External file inclusion handling
- **ID Validation**: Section ID parsing and validation

**Expected Outcomes**:
- 35+ section-meta parsing tests renamed
- 35+ approval files renamed
- Tests organized into logical subcategories
- Tests passing
- Commit created

#### Step 6: Reorganize Content and TOC Tests
- [ ] **[PENDING]** Rename 20+ content tests under `describe('Content and TOC Processing')`
- [ ] **[PENDING]** Group by subcategories: Content Location, TOC Configuration, TOC Styles
- [ ] **[PENDING]** Handle parameterized .each() tests appropriately
- [ ] **[PENDING]** Use pattern: `{content type} {verb} {scenario}`
- [ ] **[PENDING]** Update associated approval files (20+ files)
- [ ] **[PENDING]** Run tests and commit if passing

**Content Tests Categories**:
- **Content Location**: Content placement validation
- **TOC Configuration**: Table of contents setup and validation
- **TOC Styles**: Bullet style processing (no-table, labeled, numbered, etc.)

**Expected Outcomes**:
- 20+ content and TOC tests renamed
- 20+ approval files renamed
- Parameterized tests properly handled
- Tests passing
- Commit created

#### Step 7: Reorganize Path Resolution and Error Handling Tests
- [ ] **[PENDING]** Rename get-path test under `describe('Path Resolution')`
- [ ] **[PENDING]** Rename 9 error handling tests under `describe('Error Handling')`
- [ ] **[PENDING]** Group error tests by error category
- [ ] **[PENDING]** Use pattern: `{error condition} produces {error type}`
- [ ] **[PENDING]** Update associated approval files (10 files)
- [ ] **[PENDING]** Run tests and commit if passing

**Path and Error Tests**:
- **Path Resolution**: Dynamic path handling with variable table integration
- **Error Handling**: Various document structure validation errors

**Expected Outcomes**:
- 10 path resolution and error handling tests renamed
- 10 approval files renamed
- Tests logically grouped
- Tests passing
- Commit created

### Phase 3: Test Structure Modernization

#### Step 8: Update Test Structure and Imports
- [ ] **[PENDING]** Reorganize describe blocks to match new test categories
- [ ] **[PENDING]** Reduce nesting complexity from current deep hierarchy
- [ ] **[PENDING]** Ensure all imports follow AI Testing Codex patterns
- [ ] **[PENDING]** Add JSDoc comments for each test group
- [ ] **[PENDING]** Update variable naming to match AI Testing Codex
- [ ] **[PENDING]** Run tests and commit if passing

**Expected Changes**:
```typescript
// Old structure (deeply nested)
describe('astDoculisp', () => {
  describe('basic functionality', () => { ... })
  describe('lisp', () => {
    describe('header', () => { ... })
    describe('section-meta', () => {
      describe('title', () => { ... })
      describe('author', () => { ... })
      describe('ref-link', () => { ... })
      describe('subtitle', () => { ... })
      describe('include', () => { ... })
      describe('id', () => { ... })
    })
    describe('content', () => { ... })
    describe('get-path', () => { ... })
  })
  describe('error handling', () => { ... })
})

// New structure (flatter, clearer)
describe('Doculisp AST Parser', () => {
  describe('Basic Doculisp Parsing', () => { ... })
  describe('Header Parsing', () => { ... })
  describe('Section-Meta Parsing', () => {
    // Sub-grouped but not deeply nested
  })
  describe('Content and TOC Processing', () => { ... })
  describe('Path Resolution', () => { ... })
  describe('Error Handling', () => { ... })
})
```

**Expected Outcomes**:
- Modernized test structure with reduced nesting
- Clear test organization with better navigation
- Tests passing
- Commit created

#### Step 9: Apply AI Testing Codex Patterns
- [ ] **[PENDING]** Ensure all test setup follows the AI Testing Codex builder patterns
- [ ] **[PENDING]** Standardize variable naming (parse, verifyAsJson, toResult, variableTable, etc.)
- [ ] **[PENDING]** Optimize dependency injection setup
- [ ] **[PENDING]** Consolidate variable table testing patterns
- [ ] **[PENDING]** Add appropriate JSDoc comments
- [ ] **[PENDING]** Run tests and commit if passing

**Expected Outcomes**:
- Consistent with AI Testing Codex
- Standardized variable names
- Optimized test setup
- Better documentation
- Tests passing
- Commit created

### Phase 4: Final Validation and Cleanup

#### Step 10: Final Test Execution and Cleanup
- [ ] **[PENDING]** Run complete test suite to ensure all tests pass
- [ ] **[PENDING]** Verify all 70+ approval files are correctly named and functioning
- [ ] **[PENDING]** Update any test documentation or comments
- [ ] **[PENDING]** Remove any unused test helper variables
- [ ] **[PENDING]** Final commit with comprehensive changes

**Expected Outcomes**:
- All tests passing
- Clean test structure
- No unused code
- Final commit created

#### Step 11: Plan Completion and Documentation
- [ ] **[PENDING]** Mark this plan as `[COMPLETED]`
- [ ] **[PENDING]** Document any deviations or lessons learned
- [ ] **[PENDING]** Provide summary of changes made
- [ ] **[PENDING]** Note Doculisp semantic parsing patterns established

**Expected Outcomes**:
- Plan marked complete
- Summary documentation created
- Reorganization fully documented

## File Naming Conventions

### Test Names
- **Basic parsing**: `{input type} {verb} {result}`
- **Header parsing**: `{header type} {verb} {scenario}`
- **Section-meta elements**: `{element type} {verb} {scenario}`
- **Content processing**: `{content type} {verb} {scenario}`
- **Error handling**: `{error condition} produces {error type}`
- **Structure**: Use sentence structure with spaces (noun verb pattern)

### Approval Files
- **Pattern**: `astDoculisp.test.{describe_block}_{test_name_with_underscores}.approved.json`
- **Examples**: 
  - `astDoculisp.test.basic_doculisp_parsing_empty_AST_input_produces_empty_Doculisp.approved.json`
  - `astDoculisp.test.header_parsing_simple_headers_simple_header_with_parameter_parses_successfully.approved.json`
  - `astDoculisp.test.section_meta_parsing_title_processing_single_title_parses_successfully.approved.json`
  - `astDoculisp.test.content_and_toc_processing_toc_styles_numbered_labeled_style_parses_successfully.approved.json`
- **Note**: Approval files use underscores to replace spaces in test names for file system compatibility

### Describe Blocks
- **Main descriptor**: `Doculisp AST Parser`
- **Functional groupings**: `Basic Doculisp Parsing`, `Header Parsing`, `Section-Meta Parsing`, `Content and TOC Processing`, `Path Resolution`, `Error Handling`
- **Sub-groupings**: Organize by functionality within each major category (reduce deep nesting)
- **Descriptive names**: Names that indicate the Doculisp parsing capability being tested

## Quality Gates

Each step must pass these gates:
1. **Tests Pass**: All existing functionality preserved
2. **Approval Files**: Correctly renamed and functioning (70+ files)
3. **Naming Convention**: Follows established patterns with sentence structure
4. **AI Testing Codex**: Adheres to documented best practices
5. **Doculisp AST Parser Understanding**: References AI Doculisp AST Parser Codex appropriately
6. **Commit Message**: Uses Arlo's Risk-Aware Commit Notation
7. **Variable Table Integration**: Proper handling of variable table testing patterns

## Risk Mitigation

- **Backup Strategy**: Original file backed up before changes
- **Incremental Changes**: Small, testable changes with immediate validation
- **Rollback Plan**: Can revert to backup if any step fails
- **Test Validation**: Each step must pass tests before proceeding
- **Approval File Tracking**: Careful management of 70+ approval file renames
- **Complex Structure**: Systematic approach to reducing nesting complexity
- **Variable Table Testing**: Preserve integration between Doculisp parsing and variable table validation

## Success Criteria

The reorganization is complete when:
1. All existing tests pass with new names (70+ tests)
2. All approval files correctly renamed and functioning (70+ files)
3. Test structure follows AI Testing Codex patterns
4. Naming conventions are consistent throughout
5. No regression in functionality
6. Improved readability and maintainability
7. Reduced nesting complexity in describe block structure
8. Clear categorization of Doculisp document functionality
9. Foundation established for future Doculisp AST parser test expansion
10. Variable table integration patterns preserved and standardized

## Special Considerations

- **Very Large File**: 70+ tests and approval files to reorganize
- **Complex Nested Structure**: Deep describe block hierarchy needs flattening
- **Variable Table Integration**: Tests involve complex variable table interactions
- **Parameterized Tests**: .each() tests for TOC bullet styles need careful handling
- **AI Doculisp AST Parser Codex**: Must reference appropriate Doculisp semantic concepts
- **Document Structure Domain**: Tests involve complex Doculisp document validation rules
- **Approval Testing**: Heavy use of approval files for document structure validation
- **Business Logic**: Tests combine parsing with semantic validation and business rules

---

**REMEMBER**: After each step, wait for human confirmation before proceeding to the next step. Update this plan by marking completed steps as `[COMPLETED]`.