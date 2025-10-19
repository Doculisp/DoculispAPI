# String Writer Test Reorganization Plan

## Overview

This plan provides a systematic approach to reorganize and rename the `stringWriter.test.ts` file and its associated approval files to follow modern testing conventions and improve maintainability. The reorganization will align with the AI Testing Codex principles while maintaining all existing functionality.

## Prerequisites

**CRITICAL**: Before executing any step, the copilot MUST:
1. Read the **AI Testing Codex** (`.github/AI-Testing-Codex.md`) in full
2. Read the **AI String Writer Codex** (`.github/AI-String-Writer-Codex.md`) for final markdown generation understanding
3. Read this complete plan document
4. After every 2-3 test reorganizations, re-read both the AI Testing Codex and this plan
5. After summarizing the conversation, re-read both documents

## Plan Execution Rules

1. **Step-by-step execution**: Complete each step individually and wait for confirmation before proceeding
2. **Test validation**: After each step, run tests. If tests pass, commit the changes. If tests fail, do NOT mark the step complete
3. **Plan updates**: Update this plan document after each completed step by marking it `[COMPLETED]`
4. **Approval file tracking**: Each step must include renaming associated approval files to match new test names

## Jest Testing Requirements

**IMPORTANT**: All test commands in this plan use Jest directly via `npx jest` rather than `npm test`. This is because npm does not properly pass command-line arguments to Jest. 

**Correct Commands:**
- Build and run specific test file: `npm run build && npx jest --testPathPattern=filename`
- Build and run all tests: `npm run build && npx jest`
- Build and run tests with watch mode: `npm run build && npx jest --watch`

**DO NOT USE:** `npm test -- --testPathPattern=filename` (this will not work correctly)

### CRITICAL BUILD REQUIREMENT

Before running any tests, you MUST build the TypeScript project first. The Doculisp project uses a sophisticated dependency injection container that auto-discovers modules from the compiled `dist/` folder. If you run tests without building first, the DI container will fail to find required modules and tests will fail with module resolution errors.

**Required workflow:**
1. `npm run build` (compiles TypeScript to dist/)
2. `npx jest [options] [testPathPattern]` (runs tests against compiled code)

**Combined command pattern:** `npm run build && npx jest [options] [testPathPattern]`

This build requirement applies to ALL test executions throughout this reorganization plan.

## Current State Analysis

The current `stringWriter.test.ts` has these issues:
- Deeply nested structure (6+ levels of describe blocks) makes navigation difficult
- Inconsistent naming conventions (mixing "should" and unclear descriptions)
- 6 nearly identical table of contents tests with different bullet styles
- Complex file system mocking scattered throughout nested structures
- Poor test organization with unclear describe block hierarchy
- Non-descriptive test names that don't clearly indicate what is being tested

## Target State

After reorganization:
- Clear, descriptive test names following consistent conventions
- Logical test grouping with meaningful describe blocks
- Consolidated table of contents tests in one category
- Consistent file system mocking patterns
- Better separation of concerns between test categories

## Reorganization Steps

### Phase 1: Setup and Preparation

#### Step 1: Create Backup and Analyze Current Structure
- [ ] **[PENDING]** Create backup of current test file and approval files
- [ ] **[PENDING]** Document all current approval files and their mappings
- [ ] **[PENDING]** Commit backup with message: `". d Creates backup before string writer test reorganization"`

**Expected Outcomes**: 
- Backup files created
- Current state documented
- Safe starting point established

#### Step 2: Plan Test Name Mappings
- [ ] **[PENDING]** Create mapping document showing old test names → new test names
- [ ] **[PENDING]** Create mapping document showing old approval files → new approval files
- [ ] **[PENDING]** Validate no naming conflicts exist

**Expected Outcomes**:
- Complete rename mapping documented
- No conflicts identified
- Clear path forward established

### Phase 2: Core Test Structure Reorganization

#### Step 3: Reorganize Error Handling Tests
- [ ] **[PENDING]** Rename error handling test to follow pattern: `{error condition} returns {expected result}`
- [ ] **[PENDING]** Update associated approval files
- [ ] **[PENDING]** Ensure tests follow AI Testing Codex patterns
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should not write an error` → `error propagation returns original error`

**Expected Outcomes**:
- 1 error handling test renamed
- Associated approval files renamed
- Tests passing
- Commit created

#### Step 4: Reorganize Text Processing Tests
- [ ] **[PENDING]** Rename text processing tests under `describe('text processing')`
- [ ] **[PENDING]** Use pattern: `{text type} {verb} {scenario}`
- [ ] **[PENDING]** Update associated approval files (4 files)
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should successfully write an empty string` → `empty text processing produces empty result`
- `should write a simple text of "hello"` → `simple text processing renders correctly`
- `should write text of "blow fish"` → `text with spaces renders correctly`
- `should write a multiline code block` → `complex markdown with code blocks renders correctly`

**Expected Outcomes**:
- 4 text processing tests renamed
- 4 approval files renamed
- Tests passing
- Commit created

#### Step 5: Reorganize Doculisp Structure Processing Tests
- [ ] **[PENDING]** Rename Doculisp structure tests under `describe('doculisp structure processing')`
- [ ] **[PENDING]** Use pattern: `{structure type} processing generates {expected output}`
- [ ] **[PENDING]** Update associated approval files (4 files)
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should write the title` → `basic title processing generates correct header`
- `should write the title and subtitle` → `title and subtitle processing generates correct headers`
- `should write the title at different depth` → `title depth variation affects header levels`
- `should write the dynamic header` → `dynamic header processing generates correct markdown`

**Expected Outcomes**:
- 4 structure processing tests renamed
- 4 approval files renamed
- Tests passing
- Commit created

#### Step 6: Reorganize External Document Integration Test
- [ ] **[PENDING]** Rename external document test under `describe('external document integration')`
- [ ] **[PENDING]** Use pattern: `{integration scenario} renders correctly`
- [ ] **[PENDING]** Update associated approval files (1 file)
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should write the contents of a sub document` → `single external document inclusion renders correctly`

**Expected Outcomes**:
- 1 integration test renamed
- 1 approval file renamed
- Tests passing
- Commit created

#### Step 7: Reorganize Table of Contents Generation Tests
- [ ] **[PENDING]** Rename TOC tests under `describe('table of contents generation')`
- [ ] **[PENDING]** Use pattern: `{toc style} table of contents generates correctly`
- [ ] **[PENDING]** Update associated approval files (6 files)
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should write the table of contents` → `default table of contents generates correctly`
- `should write the unlabeled table of contents` → `unlabeled table of contents generates correctly`
- `should write the numbered table of contents` → `numbered table of contents generates correctly`
- `should write the numbered-labeled table of contents` → `numbered-labeled table of contents generates correctly`
- `should write the bulleted table of contents` → `bulleted table of contents generates correctly`
- `should write the bulleted-labeled table of contents` → `bulleted-labeled table of contents generates correctly`

**Expected Outcomes**:
- 6 TOC generation tests renamed
- 6 approval files renamed
- Tests passing
- Commit created

### Phase 3: Test Structure Modernization

#### Step 8: Update Test Structure and Imports
- [ ] **[PENDING]** Reorganize describe blocks to match new test categories
- [ ] **[PENDING]** Ensure all imports follow AI Testing Codex patterns
- [ ] **[PENDING]** Add JSDoc comments for major test groups
- [ ] **[PENDING]** Run tests and commit if passing

**Expected Changes**:
```typescript
// Old structure (deeply nested)
describe('stringWriter', () => {
  describe('writing markup', () => {
    describe('text block', () => { ... })
    describe('lisp blocks', () => {
      describe('section-meta', () => {
        describe('title', () => { ... })
      })
      describe('dynamic header', () => { ... })
      describe('sub documents', () => { ... })
    })
  })
})

// New structure (flattened and logical)
describe('String Writer', () => {
  describe('Error Handling', () => { ... })
  describe('Text Processing', () => { ... })
  describe('Doculisp Structure Processing', () => { ... })
  describe('External Document Integration', () => { ... })
  describe('Table of Contents Generation', () => { ... })
})
```

**Expected Outcomes**:
- Modernized test structure
- Clear test organization
- Tests passing
- Commit created

#### Step 9: Apply AI Testing Codex Patterns
- [ ] **[PENDING]** Ensure all test setup follows the AI Testing Codex builder patterns
- [ ] **[PENDING]** Standardize variable naming (toResult, verifyAsJson, etc.)
- [ ] **[PENDING]** Add appropriate JSDoc comments for test groups
- [ ] **[PENDING]** Run tests and commit if passing

**Expected Outcomes**:
- Consistent with AI Testing Codex
- Standardized variable names
- Better documentation
- Tests passing
- Commit created

### Phase 4: Final Validation and Cleanup

#### Step 10: Final Test Execution and Cleanup
- [ ] **[PENDING]** Run complete test suite to ensure all tests pass
- [ ] **[PENDING]** Verify all approval files are correctly named and functioning
- [ ] **[PENDING]** Remove any orphaned approval files
- [ ] **[PENDING]** Update any test documentation or comments
- [ ] **[PENDING]** Final commit with comprehensive changes

**Expected Outcomes**:
- All tests passing
- No orphaned files
- Clean test structure
- Final commit created

#### Step 11: Cleanup Backup Files
- [ ] **[PENDING]** Delete backup files created during reorganization
- [ ] **[PENDING]** Remove any temporary files or directories created during process
- [ ] **[PENDING]** Verify no backup files remain in working directory
- [ ] **[PENDING]** Commit cleanup with message: `". d Removes backup files after string writer test reorganization"`

**Expected Outcomes**:
- All backup files removed
- Clean working directory
- Cleanup commit created

#### Step 12: Plan Completion and Documentation
- [ ] **[PENDING]** Mark this plan as `[COMPLETED]`
- [ ] **[PENDING]** Document any deviations or lessons learned
- [ ] **[PENDING]** Provide summary of changes made

**Expected Outcomes**:
- Plan marked complete
- Summary documentation created
- Reorganization fully documented

## File Naming Conventions

### Test Names
- **Error handling**: `{error condition} returns {expected result}`
- **Text processing**: `{text type} {verb} {scenario}`
- **Structure processing**: `{structure type} processing generates {expected output}`
- **Integration**: `{integration scenario} renders correctly`
- **TOC generation**: `{toc style} table of contents generates correctly`
- **Structure**: Use sentence structure with spaces (noun verb pattern)

### Approval Files
- **Pattern**: `stringWriter.test.{describe_block}_{test_name_with_underscores}.approved.{md|json}`
- **Example**: `stringWriter.test.text_processing_simple_text_processing_renders_correctly.approved.md`
- **Note**: Approval files use underscores to replace spaces in test names for file system compatibility

## Quality Gates

Each step must pass these gates:
1. **Tests Pass**: All existing functionality preserved
2. **Approval Files**: Correctly renamed and functioning
3. **Naming Convention**: Follows established patterns
4. **AI Testing Codex**: Adheres to documented best practices
5. **Commit Message**: Uses Arlo's Risk-Aware Commit Notation

## Risk Mitigation

- **Backup Strategy**: All original files backed up before changes
- **Incremental Changes**: Small, testable changes with immediate validation
- **Rollback Plan**: Can revert to backup if any step fails
- **Test Validation**: Each step must pass tests before proceeding

## Success Criteria

The reorganization is complete when:
1. All existing tests pass with new names
2. All approval files correctly renamed and functioning
3. Test structure follows AI Testing Codex patterns
4. Naming conventions are consistent throughout
5. No regression in functionality
6. Improved readability and maintainability

---

**REMEMBER**: After each step, wait for human confirmation before proceeding to the next step. Update this plan by marking completed steps as `[COMPLETED]`.