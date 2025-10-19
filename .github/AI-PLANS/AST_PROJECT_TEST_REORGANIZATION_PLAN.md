# AST Project Test Reorganization Plan

## Overview

This plan provides a systematic approach to reorganize and rename the `astProject.test.ts` file to follow modern testing conventions and improve maintainability. The reorganization will align with the AI Testing Codex principles while maintaining all existing functionality. This test file covers project AST parsing functionality that handles `.dlproj` project file structures for batch document compilation configurations, which is a critical component in the Doculisp processing pipeline.

## Prerequisites

**CRITICAL**: Before executing any step, the copilot MUST:
1. Read the **AI Testing Codex** (`.github/AI-Testing-Codex.md`) in full
2. Read the **AI AST Project Parser Codex** (`.github/AI-AST-Project-Parser-Codex.md`) for project parsing understanding (if available)
3. Read the **AI Assistant Codex** (`.github/AI-Assistant-Codex.md`) for Doculisp syntax understanding
4. Read this complete plan document
5. Understand the commit message format from `.github/.copilot-instructions.md`

## Plan Execution Rules

1. **Step-by-step execution**: Complete each step individually and wait for confirmation before proceeding
2. **Test validation**: After each step, run tests. If tests pass, commit the changes. If tests fail, do NOT mark the step complete
3. **Plan updates**: Update this plan document after each completed step by marking it `[COMPLETED]`
4. **Approval file tracking**: Each step must include renaming all 23+ associated approval files to match new test names
5. **Consolidation consideration**: This file may receive additional tests from astDoculisp.dlproj.test.ts consolidation

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
2. **When summarizing the conversation**: Re-read this plan, AI Testing Codex, and any relevant AI Assistant Codex sections
3. **After any extended pause or context switch**: Re-read all prerequisite documents
4. **Before starting each major reorganization phase**: Re-read relevant sections of this plan
5. **When encountering uncertainty or inconsistency**: Stop and re-read the appropriate codex documents

## Current State Analysis

The current `astProject.test.ts` has these issues:
- Non-descriptive main describe block using generic "astProject" name
- Inconsistent test naming with all tests using "should" prefix pattern
- Mixed test organization with some root-level tests and nested describe blocks
- 23+ approval files using old naming conventions
- Test structure doesn't clearly separate different project parsing scenarios
- Limited use of AI Testing Codex patterns for dependency injection
- Variable naming inconsistencies (resultBuilder vs parser setup)

**Current Test Structure:**
- **Root Level Tests**: 4 tests (empty project, empty documents, error propagation, single documents validation)
- **Basic Project Documents**: 4 tests (simple document structure parsing and validation)
- **ID Project Documents**: 16+ tests (identified document parsing with extensive error handling)

## Target State

After reorganization:
- Clear, descriptive test names following sentence structure with spaces
- Logical test grouping by project parsing functionality
- Consistent naming conventions following AI Testing Codex patterns
- Better describe block organization separating parsing scenarios, document types, and error conditions
- All 23+ approval files correctly renamed
- Improved readability and maintainability
- Clear separation between basic project parsing, document structure validation, and error handling
- Ready to receive consolidated tests from astDoculisp.dlproj.test.ts

## Reorganization Steps

### Phase 1: Setup and Preparation

#### Step 1: Create Backup and Analyze Current Structure
- [ ] **[PENDING]** Create backup of current test file
- [ ] **[PENDING]** Document current approval files (23+ files)
- [ ] **[PENDING]** Map current test organization and nested structure
- [ ] **[PENDING]** Commit backup with message: `". d Creates backup before AST project test reorganization"`

**Expected Outcomes**: 
- Backup file created
- Current state documented with structure mapping
- Safe starting point established

#### Step 2: Plan Test Name Mappings
- [ ] **[PENDING]** Create mapping document showing old test names → new test names
- [ ] **[PENDING]** Create mapping document showing old approval files → new approval files (23+ mappings)
- [ ] **[PENDING]** Plan describe block restructuring for better organization
- [ ] **[PENDING]** Validate no naming conflicts exist

**Expected Outcomes**:
- Complete rename mapping documented
- Describe block restructuring planned
- No conflicts identified
- Clear path forward established

### Phase 2: Core Test Structure Reorganization

#### Step 3: Reorganize Basic Project Structure Tests
- [ ] **[PENDING]** Rename 4 root-level tests under `describe('Basic Project Structure')`
- [ ] **[PENDING]** Group by subcategories: Empty Input, Error Propagation, Structure Validation
- [ ] **[PENDING]** Use pattern: `{input type} {verb} {result}`
- [ ] **[PENDING]** Update associated approval files (4 files)
- [ ] **[PENDING]** Run tests and commit if passing

**Root Level Tests to Rename**:
- `should handle an empty project file` → `empty project file produces empty project`
- `should handle an empty documents block` → `empty documents block produces empty documents`
- `should return an error when given an error` → `failed input parsing propagates error`
- `should enforce only a single documents block` → `duplicate documents blocks produce error`

**Expected Outcomes**:
- 4 basic project structure tests renamed
- 4 approval files renamed
- Tests logically grouped
- Tests passing
- Commit created

#### Step 4: Reorganize Basic Document Parsing Tests
- [ ] **[PENDING]** Rename 4 basic project document tests under `describe('Basic Document Parsing')`
- [ ] **[PENDING]** Group by subcategories: Single Documents, Multiple Documents, Required Fields
- [ ] **[PENDING]** Use pattern: `{document type} {verb} {scenario}`
- [ ] **[PENDING]** Update associated approval files (4 files)
- [ ] **[PENDING]** Run tests and commit if passing

**Basic Document Tests to Rename**:
- `should parse a single document` → `single document configuration parses successfully`
- `should parse a two document` → `multiple document configuration parses successfully`
- `should fail if document block is missing the source block` → `document without source block produces error`
- `should fail if document block is missing the output block` → `document without output block produces error`

**Expected Outcomes**:
- 4 basic document parsing tests renamed
- 4 approval files renamed
- Tests logically grouped by document complexity
- Tests passing
- Commit created

#### Step 5: Reorganize ID Document Parsing Tests
- [ ] **[PENDING]** Rename 16+ ID project document tests under `describe('ID Document Parsing')`
- [ ] **[PENDING]** Group by subcategories: Valid ID Documents, ID Validation, Structure Validation, Error Handling
- [ ] **[PENDING]** Use pattern: `{document type} {verb} {scenario}`
- [ ] **[PENDING]** Update associated approval files (16+ files)
- [ ] **[PENDING]** Run tests and commit if passing

**ID Document Tests Categories**:
- **Valid ID Documents**: Successful parsing scenarios
- **ID Validation**: Identifier format and uniqueness validation
- **Structure Validation**: Required fields and document structure
- **Error Handling**: Various malformed document scenarios

**Expected Outcomes**:
- 16+ ID document parsing tests renamed
- 16+ approval files renamed
- Tests organized into logical subcategories
- Tests passing
- Commit created

### Phase 3: Test Structure Modernization

#### Step 6: Update Test Structure and Imports
- [ ] **[PENDING]** Reorganize describe blocks to match new test categories
- [ ] **[PENDING]** Ensure all imports follow AI Testing Codex patterns
- [ ] **[PENDING]** Add JSDoc comments for each test group
- [ ] **[PENDING]** Update variable naming to match AI Testing Codex
- [ ] **[PENDING]** Standardize test builder usage patterns
- [ ] **[PENDING]** Run tests and commit if passing

**Expected Changes**:
```typescript
// Old structure
describe('astProject', () => {
  // 4 root level tests
  describe('basic project documents', () => { ... })
  describe('id project documents', () => { ... })
})

// New structure  
describe('Project AST Parser', () => {
  describe('Basic Project Structure', () => {
    describe('Empty Input Handling', () => { ... })
    describe('Error Propagation', () => { ... })
    describe('Structure Validation', () => { ... })
  })
  describe('Basic Document Parsing', () => {
    describe('Single Documents', () => { ... })
    describe('Multiple Documents', () => { ... })
    describe('Required Fields', () => { ... })
  })
  describe('ID Document Parsing', () => {
    describe('Valid ID Documents', () => { ... })
    describe('ID Validation', () => { ... })
    describe('Structure Validation', () => { ... })
    describe('Error Handling', () => { ... })
  })
})
```

**Expected Outcomes**:
- Modernized test structure with clear hierarchy
- Clear test organization with subcategories
- Tests passing
- Commit created

#### Step 7: Apply AI Testing Codex Patterns
- [ ] **[PENDING]** Ensure all test setup follows the AI Testing Codex builder patterns
- [ ] **[PENDING]** Standardize variable naming (resultBuilder, parser, verifyAsJson, etc.)
- [ ] **[PENDING]** Optimize dependency injection setup
- [ ] **[PENDING]** Consolidate variable table usage patterns
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

#### Step 8: Final Test Execution and Cleanup
- [ ] **[PENDING]** Run complete test suite to ensure all tests pass
- [ ] **[PENDING]** Verify all 23+ approval files are correctly named and functioning
- [ ] **[PENDING]** Update any test documentation or comments
- [ ] **[PENDING]** Remove any unused test helper variables
- [ ] **[PENDING]** Final commit with comprehensive changes

**Expected Outcomes**:
- All tests passing
- Clean test structure
- No unused code
- Final commit created

#### Step 9: Cleanup Backup Files
- [ ] **[PENDING]** Delete backup files created during reorganization
- [ ] **[PENDING]** Remove any temporary files or directories created during process
- [ ] **[PENDING]** Verify no backup files remain in working directory
- [ ] **[PENDING]** Commit cleanup with message: `". d Removes backup files after AST project test reorganization"`

**Expected Outcomes**:
- All backup files removed
- Clean working directory
- Cleanup commit created

#### Step 10: Plan Completion and Documentation
- [ ] **[PENDING]** Mark this plan as `[COMPLETED]`
- [ ] **[PENDING]** Document any deviations or lessons learned
- [ ] **[PENDING]** Provide summary of changes made
- [ ] **[PENDING]** Note readiness for astDoculisp.dlproj.test.ts consolidation
- [ ] **[PENDING]** Document project parsing patterns established

**Expected Outcomes**:
- Plan marked complete
- Summary documentation created
- Reorganization fully documented
- Consolidation readiness noted

## File Naming Conventions

### Test Names
- **Basic project structure**: `{input type} {verb} {result}`
- **Document parsing**: `{document type} {verb} {scenario}`
- **ID document parsing**: `{document type} {verb} {scenario}`
- **Error handling**: `{error condition} produces {error type}`
- **Structure**: Use sentence structure with spaces (noun verb pattern)

### Approval Files
- **Pattern**: `astProject.test.{describe_block}_{test_name_with_underscores}.approved.json`
- **Examples**: 
  - `astProject.test.basic_project_structure_empty_input_handling_empty_project_file_produces_empty_project.approved.json`
  - `astProject.test.basic_document_parsing_single_documents_single_document_configuration_parses_successfully.approved.json`
  - `astProject.test.id_document_parsing_id_validation_duplicate_identifiers_produce_error.approved.json`
- **Note**: Approval files use underscores to replace spaces in test names for file system compatibility

### Describe Blocks
- **Main descriptor**: `Project AST Parser`
- **Functional groupings**: `Basic Project Structure`, `Basic Document Parsing`, `ID Document Parsing`
- **Sub-groupings**: Organize by functionality and complexity within each major category
- **Descriptive names**: Names that indicate the project parsing capability being tested

## Quality Gates

Each step must pass these gates:
1. **Tests Pass**: All existing functionality preserved
2. **Approval Files**: Correctly renamed and functioning (23+ files)
3. **Naming Convention**: Follows established patterns with sentence structure
4. **AI Testing Codex**: Adheres to documented best practices
5. **Project Parser Understanding**: References appropriate project parsing concepts
6. **Commit Message**: Uses Arlo's Risk-Aware Commit Notation
7. **Consolidation Ready**: Structure prepared for receiving tests from astDoculisp.dlproj.test.ts

## Risk Mitigation

- **Backup Strategy**: Original file backed up before changes
- **Incremental Changes**: Small, testable changes with immediate validation
- **Rollback Plan**: Can revert to backup if any step fails
- **Test Validation**: Each step must pass tests before proceeding
- **Approval File Tracking**: Careful management of 23+ approval file renames
- **Consolidation Preparation**: Structure designed to accommodate additional tests

## Success Criteria

The reorganization is complete when:
1. All existing tests pass with new names (23+ tests)
2. All approval files correctly renamed and functioning (23+ files)
3. Test structure follows AI Testing Codex patterns
4. Naming conventions are consistent throughout
5. No regression in functionality
6. Improved readability and maintainability
7. Clear categorization of project parsing functionality by complexity and type
8. Foundation established for future project parser test expansion
9. Structure ready to receive consolidated tests from astDoculisp.dlproj.test.ts
10. Variable table integration patterns standardized

## Special Considerations

- **Large File**: 23+ tests and approval files to reorganize
- **Complex Functionality**: Project parsing involves multiple document types and extensive validation
- **Consolidation Target**: This file will likely receive additional tests from astDoculisp.dlproj.test.ts
- **Project File Domain**: Tests involve complex .dlproj file parsing for batch compilation
- **Variable Table Integration**: Tests involve variable table setup and usage
- **Error Handling**: Extensive error validation scenarios require careful categorization
- **Approval Testing**: Heavy use of approval files for project structure validation
- **Document Structure Variety**: Tests cover both simple and identified document structures

---

**REMEMBER**: After each step, wait for human confirmation before proceeding to the next step. Update this plan by marking completed steps as `[COMPLETED]`.