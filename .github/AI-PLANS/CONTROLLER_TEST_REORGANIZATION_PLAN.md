# Controller Test Reorganization Plan

## Overview

This plan provides a systematic approach to reorganize and rename the `controller.test.ts` file and its associated approval files to follow modern testing conventions and improve maintainability. The reorganization will align with the AI Testing Codex principles while maintaining all existing functionality.

## Prerequisites

**CRITICAL**: Before executing any step, the copilot MUST:
1. Read the **AI Testing Codex** (`.github/AI-Testing-Codex.md`) in full
2. Read this complete plan document
3. After every 2-3 test reorganizations, re-read both the AI Testing Codex and this plan
4. After summarizing the conversation, re-read both documents

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

The current `controller.test.ts` has these issues:
- Generic "controller" describe block name doesn't indicate the component's purpose
- Test names mix different scenarios (success, parsing errors, writing errors, validation errors)
- Complex mock setup with multiple configuration objects scattered throughout tests
- Poor test organization with unclear separation between `test` and `compile` methods
- Validation error tests separated from main functionality tests
- Non-descriptive test names that don't clearly indicate controller functionality

## Target State

After reorganization:
- Clear, descriptive test names following consistent conventions
- Logical test grouping with meaningful describe blocks
- Consolidated error handling tests by category
- Consistent mock configuration patterns
- Better separation of concerns between different controller operations

## Reorganization Steps

### Phase 1: Setup and Preparation

#### Step 1: Create Backup and Analyze Current Structure
- [x] **[COMPLETED]** Create backup of current test file and approval files
- [x] **[COMPLETED]** Document all current approval files and their mappings
- [x] **[COMPLETED]** Commit backup with message: `". d Creates backup before controller test reorganization"`

**Expected Outcomes**: 
- Backup files created
- Current state documented
- Safe starting point established

#### Step 2: Plan Test Name Mappings
- [x] **[COMPLETED]** Create mapping document showing old test names → new test names
- [x] **[COMPLETED]** Create mapping document showing old approval files → new approval files
- [x] **[COMPLETED]** Validate no naming conflicts exist

**Expected Outcomes**:
- Complete rename mapping documented
- No conflicts identified
- Clear path forward established

### Phase 2: Core Test Structure Reorganization

#### Step 3: Reorganize Test Method Tests
- [ ] **[PENDING]** Rename test method tests under `describe('test method')`
- [ ] **[PENDING]** Use pattern: `{scenario} {verb} {expected outcome}`
- [ ] **[PENDING]** Update associated approval files (3 files)
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should test handle a successful file` → `successful file processing completes correctly`
- `should fail a file that cannot parse an ast` → `ast parsing failure returns error`
- `should fail a file that cannot be converted to markdown` → `markdown conversion failure returns error`

**Expected Outcomes**:
- 3 test method tests renamed
- 3 approval files renamed
- Tests passing
- Commit created

#### Step 4: Reorganize Compile Method Tests
- [ ] **[PENDING]** Rename compile method tests under `describe('compile method')`
- [ ] **[PENDING]** Use pattern: `{scenario} {verb} {expected outcome}`
- [ ] **[PENDING]** Update associated approval files (4 files)
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should be successful if everything is successful` → `successful compilation completes correctly`
- `should fail if a file cannot parse an ast` → `ast parsing failure returns error`
- `should fail a file that cannot be converted to markdown` → `markdown conversion failure returns error`
- `should fail if writing the file fails` → `file writing failure returns error`

**Expected Outcomes**:
- 4 compile method tests renamed
- 4 approval files renamed (though some may duplicate names from test method)
- Tests passing
- Commit created

#### Step 5: Reorganize Validation Error Tests
- [ ] **[PENDING]** Rename validation tests under `describe('validation errors')`
- [ ] **[PENDING]** Use pattern: `{validation condition} produces validation error`
- [ ] **[PENDING]** Update associated approval files (0 files - these use expect assertions)
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should fail with standardized error when non-project file has no destination` → `missing destination path produces validation error`
- `should fail with standardized error when project file has destination path` → `project file with destination produces validation error`
- `should fail with standardized error when no source file is given` → `missing source file produces validation error`

**Expected Outcomes**:
- 3 validation error tests renamed
- No approval files to rename (these use direct assertions)
- Tests passing
- Commit created

### Phase 3: Test Structure Modernization

#### Step 6: Update Test Structure and Imports
- [ ] **[PENDING]** Reorganize describe blocks to match new test categories
- [ ] **[PENDING]** Ensure all imports follow AI Testing Codex patterns
- [ ] **[PENDING]** Add JSDoc comments for major test groups
- [ ] **[PENDING]** Run tests and commit if passing

**Expected Changes**:
```typescript
// Old structure
describe('controller', () => {
  describe('test', () => { ... })
  describe('compile', () => { ... })
  describe('test validation errors', () => { ... })
})

// New structure
describe('Controller', () => {
  describe('Test Method', () => { ... })
  describe('Compile Method', () => { ... })
  describe('Validation Errors', () => { ... })
})
```

**Expected Outcomes**:
- Modernized test structure
- Clear test organization
- Tests passing
- Commit created

#### Step 7: Apply AI Testing Codex Patterns
- [ ] **[PENDING]** Ensure all test setup follows the AI Testing Codex builder patterns
- [ ] **[PENDING]** Standardize variable naming (sut, verifyAsJson, etc.)
- [ ] **[PENDING]** Add appropriate JSDoc comments for test groups
- [ ] **[PENDING]** Run tests and commit if passing

**Expected Outcomes**:
- Consistent with AI Testing Codex
- Standardized variable names
- Better documentation
- Tests passing
- Commit created

### Phase 4: Final Validation and Cleanup

#### Step 8: Final Test Execution and Cleanup
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

#### Step 9: Cleanup Backup Files
- [ ] **[PENDING]** Delete backup files created during reorganization
- [ ] **[PENDING]** Remove any temporary files or directories created during process
- [ ] **[PENDING]** Verify no backup files remain in working directory
- [ ] **[PENDING]** Commit cleanup with message: `". d Removes backup files after controller test reorganization"`

**Expected Outcomes**:
- All backup files removed
- Clean working directory
- Cleanup commit created

#### Step 10: Plan Completion and Documentation
- [ ] **[PENDING]** Mark this plan as `[COMPLETED]`
- [ ] **[PENDING]** Document any deviations or lessons learned
- [ ] **[PENDING]** Provide summary of changes made

**Expected Outcomes**:
- Plan marked complete
- Summary documentation created
- Reorganization fully documented

#### Step 11: META_EXECUTION_PLAN Update
- [ ] **[PENDING]** Re-read META_EXECUTION_PLAN.md completely
- [ ] **[PENDING]** Update META_EXECUTION_PLAN.md to mark CONTROLLER_TEST_REORGANIZATION_PLAN as ✅ COMPLETED
- [ ] **[PENDING]** Add completion timestamp and notes to detailed completion log
- [ ] **[PENDING]** Commit META plan update with Arlo's notation

**Expected Outcomes**:
- META_EXECUTION_PLAN.md updated with completion status
- Progress tracking reflects current state
- Systematic execution protocol maintained

## File Naming Conventions

### Test Names
- **Method testing**: `{scenario} {verb} {expected outcome}`
- **Validation errors**: `{validation condition} produces validation error`
- **Structure**: Use sentence structure with spaces (noun verb pattern)

### Approval Files
- **Pattern**: `controller.test.{describe_block}_{test_name_with_underscores}.approved.json`
- **Example**: `controller.test.test_method_successful_file_processing_completes_correctly.approved.json`
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