# String Writer Real Write Test Reorganization Plan

## Overview

This plan provides a systematic approach to reorganize and rename the `stringWriter.realWrite.test.ts` file and its associated approval files to follow modern testing conventions and improve maintainability. The reorganization will align with the AI Testing Codex principles while maintaining all existing functionality.

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

The current `stringWriter.realWrite.test.ts` has these issues:
- Generic "when writing" describe block name doesn't indicate purpose
- Test names mix different scenarios (error handling, cross-references, documentation writing)
- 8 documentation tests are nearly identical with only file paths changing
- Poor test organization with unclear categorization
- Complex setup with working directory changes scattered throughout tests
- Non-descriptive test names that don't clearly indicate what is being tested

## Target State

After reorganization:
- Clear, descriptive test names following consistent conventions
- Logical test grouping with meaningful describe blocks
- Consolidated documentation tests in one category
- Consistent working directory management patterns
- Better separation of concerns between test categories

## Reorganization Steps

### Phase 1: Setup and Preparation

#### Step 1: Create Backup and Analyze Current Structure
- [ ] **[PENDING]** Create backup of current test file and approval files
- [ ] **[PENDING]** Document all current approval files and their mappings
- [ ] **[PENDING]** Commit backup with message: `". d Creates backup before string writer real write test reorganization"`

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
- [ ] **[PENDING]** Rename error handling test under `describe('error handling')`
- [ ] **[PENDING]** Use pattern: `{error condition} produces {expected result}`
- [ ] **[PENDING]** Update associated approval files (1 file)
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should return an error object` → `bad link references produce error result`

**Expected Outcomes**:
- 1 error handling test renamed
- 1 approval file renamed
- Tests passing
- Commit created

#### Step 4: Reorganize Cross-Reference Tests
- [ ] **[PENDING]** Rename cross-reference test under `describe('cross reference processing')`
- [ ] **[PENDING]** Use pattern: `{scenario} {verb} {expected outcome}`
- [ ] **[PENDING]** Update associated approval files (1 file)
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should correctly insert the path` → `document cross references resolve paths correctly`

**Expected Outcomes**:
- 1 cross-reference test renamed
- 1 approval file renamed
- Tests passing
- Commit created

#### Step 5: Reorganize Documentation Writing Tests
- [ ] **[PENDING]** Rename documentation tests under `describe('documentation writing')`
- [ ] **[PENDING]** Use pattern: `{document section} documentation renders correctly`
- [ ] **[PENDING]** Update associated approval files (8 files)
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should write the structure part of its own documentation` → `structure documentation renders correctly`
- `should write the doculisp part of its own documentation` → `doculisp documentation renders correctly`
- `should write the section-meta part of its own documentation` → `section-meta documentation renders correctly`
- `should write the content part of its own documentation` → `content documentation renders correctly`
- `should write the headings part of its own documentation` → `headings documentation renders correctly`
- `should write the comment part of its own documentation` → `comment documentation renders correctly`
- `should write the keywords part of its own documentation` → `keywords documentation renders correctly`
- `should write the whole of its own documentation` → `complete documentation renders correctly`

**Expected Outcomes**:
- 8 documentation tests renamed
- 8 approval files renamed
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
describe('when writing', () => {
  describe('a file with a bad link', () => { ... })
  describe('documents that cross reference each other', () => { ... })
  describe('its own documentation', () => { ... })
})

// New structure
describe('String Writer Real Write', () => {
  describe('Error Handling', () => { ... })
  describe('Cross Reference Processing', () => { ... })
  describe('Documentation Writing', () => { ... })
})
```

**Expected Outcomes**:
- Modernized test structure
- Clear test organization
- Tests passing
- Commit created

#### Step 7: Apply AI Testing Codex Patterns
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

#### Step 9: Plan Completion and Documentation
- [ ] **[PENDING]** Mark this plan as `[COMPLETED]`
- [ ] **[PENDING]** Document any deviations or lessons learned
- [ ] **[PENDING]** Provide summary of changes made

**Expected Outcomes**:
- Plan marked complete
- Summary documentation created
- Reorganization fully documented

## File Naming Conventions

### Test Names
- **Error handling**: `{error condition} produces {expected result}`
- **Cross-reference processing**: `{scenario} {verb} {expected outcome}`
- **Documentation writing**: `{document section} documentation renders correctly`
- **Structure**: Use sentence structure with spaces (noun verb pattern)

### Approval Files
- **Pattern**: `stringWriter.realWrite.test.{describe_block}_{test_name_with_underscores}.approved.{md|json|txt}`
- **Example**: `stringWriter.realWrite.test.error_handling_bad_link_references_produce_error_result.approved.json`
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