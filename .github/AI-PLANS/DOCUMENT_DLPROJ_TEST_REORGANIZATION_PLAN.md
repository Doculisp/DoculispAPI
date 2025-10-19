# Document Project File Test Reorganization Plan

## Overview

This plan provides a systematic approach to reorganize and rename the `document.dlproj.test.ts` file to follow modern testing conventions and improve maintainability. The reorganization will align with the AI Testing Codex principles while maintaining all existing functionality. This test file covers document parsing for `.dlproj` project files, which define batch compilation configurations.

## Prerequisites

**CRITICAL**: Before executing any step, the copilot MUST:
1. Read the **AI Testing Codex** (`.github/AI-Testing-Codex.md`) in full
2. Read the **AI Assistant Codex** (`.github/AI-Assistant-Codex.md`) for Doculisp syntax understanding
3. Read this complete plan document
4. Understand the commit message format from `.github/.copilot-instructions.md`

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

## Periodic Re-reading Requirements

**MANDATORY**: The copilot MUST re-read the following documents at these intervals:
1. **After every 2-3 test reorganizations**: Re-read this plan and the AI Testing Codex
2. **When summarizing the conversation**: Re-read this plan, AI Testing Codex, and any relevant AI Assistant Codex sections
3. **After any extended pause or context switch**: Re-read all prerequisite documents
4. **Before starting each major reorganization phase**: Re-read relevant sections of this plan
5. **When encountering uncertainty or inconsistency**: Stop and re-read the appropriate codex documents

## Current State Analysis

The current `document.dlproj.test.ts` has these issues:
- Non-descriptive test file name using generic "document parse dlproj file" description
- Single test with unclear naming that doesn't follow modern conventions
- Test name uses "should" prefix rather than descriptive sentence structure
- Test focuses on project file parsing but doesn't clearly indicate the scenario
- Limited test coverage with only one basic scenario

## Target State

After reorganization:
- Clear, descriptive test names following sentence structure with spaces
- Logical test grouping even for single tests
- Consistent naming conventions following AI Testing Codex patterns
- Better describe block organization that clearly indicates project file testing
- Improved readability and potential for future expansion

## Reorganization Steps

### Phase 1: Setup and Preparation

#### Step 1: Create Backup and Analyze Current Structure
- [ ] **[PENDING]** Create backup of current test file
- [ ] **[PENDING]** Document current approval file (1 file)
- [ ] **[PENDING]** Commit backup with message: `". d Creates backup before document dlproj test reorganization"`

**Expected Outcomes**: 
- Backup file created
- Current state documented
- Safe starting point established

#### Step 2: Plan Test Name Mappings
- [ ] **[PENDING]** Create mapping document showing old test names → new test names
- [ ] **[PENDING]** Create mapping document showing old approval file → new approval file
- [ ] **[PENDING]** Validate no naming conflicts exist

**Expected Outcomes**:
- Complete rename mapping documented
- No conflicts identified
- Clear path forward established

### Phase 2: Core Test Structure Reorganization

#### Step 3: Reorganize Project File Parsing Test
- [ ] **[PENDING]** Rename project file parsing test under `describe('Project File Parsing')`
- [ ] **[PENDING]** Use pattern: `{content type} {verb} {scenario}`
- [ ] **[PENDING]** Update associated approval file (1 file)
- [ ] **[PENDING]** Run tests and commit if passing

**Current Test to Rename**:
- `should handle a project file with a single document` → `single document project file parses successfully`

**Current Approval File to Rename**:
- `document.dlproj.test.document_parse_dlproj_file_should_handle_a_project_file_with_a_single_document.approved.json` → `document.dlproj.test.project_file_parsing_single_document_project_file_parses_successfully.approved.json`

**Expected Outcomes**:
- 1 project file parsing test renamed
- 1 approval file renamed
- Tests passing
- Commit created

### Phase 3: Test Structure Modernization

#### Step 4: Update Test Structure and Imports
- [ ] **[PENDING]** Reorganize describe blocks to match new test categories
- [ ] **[PENDING]** Ensure all imports follow AI Testing Codex patterns
- [ ] **[PENDING]** Add JSDoc comments for test group
- [ ] **[PENDING]** Run tests and commit if passing

**Expected Changes**:
```typescript
// Old structure
describe('document parse dlproj file', () => {
  it('should handle a project file with a single document', () => { ... })
})

// New structure  
describe('Document Project File Parser', () => {
  describe('Project File Parsing', () => {
    it('single document project file parses successfully', () => { ... })
  })
})
```

**Expected Outcomes**:
- Modernized test structure
- Clear test organization
- Tests passing
- Commit created

#### Step 5: Apply AI Testing Codex Patterns
- [ ] **[PENDING]** Ensure all test setup follows the AI Testing Codex builder patterns
- [ ] **[PENDING]** Standardize variable naming (parse, verifyAsJson, etc.)
- [ ] **[PENDING]** Add appropriate JSDoc comments
- [ ] **[PENDING]** Run tests and commit if passing

**Expected Outcomes**:
- Consistent with AI Testing Codex
- Standardized variable names
- Better documentation
- Tests passing
- Commit created

### Phase 4: Final Validation and Cleanup

#### Step 6: Final Test Execution and Cleanup
- [ ] **[PENDING]** Run complete test suite to ensure all tests pass
- [ ] **[PENDING]** Verify approval file is correctly named and functioning
- [ ] **[PENDING]** Update any test documentation or comments
- [ ] **[PENDING]** Final commit with comprehensive changes

**Expected Outcomes**:
- All tests passing
- Clean test structure
- Final commit created

#### Step 7: Cleanup Backup Files
- [ ] **[PENDING]** Delete backup files created during reorganization
- [ ] **[PENDING]** Remove any temporary files or directories created during process
- [ ] **[PENDING]** Verify no backup files remain in working directory
- [ ] **[PENDING]** Commit cleanup with message: `". d Removes backup files after document dlproj test reorganization"`

**Expected Outcomes**:
- All backup files removed
- Clean working directory
- Cleanup commit created

#### Step 8: Plan Completion and Documentation
- [ ] **[PENDING]** Mark this plan as `[COMPLETED]`
- [ ] **[PENDING]** Document any deviations or lessons learned
- [ ] **[PENDING]** Provide summary of changes made

**Expected Outcomes**:
- Plan marked complete
- Summary documentation created
- Reorganization fully documented

## File Naming Conventions

### Test Names
- **Project file parsing**: `{content type} {verb} {scenario}`
- **Structure**: Use sentence structure with spaces (noun verb pattern)

### Approval Files
- **Pattern**: `document.dlproj.test.{describe_block}_{test_name_with_underscores}.approved.json`
- **Example**: `document.dlproj.test.project_file_parsing_single_document_project_file_parses_successfully.approved.json`
- **Note**: Approval files use underscores to replace spaces in test names for file system compatibility

### Describe Blocks
- **Main descriptor**: `Document Project File Parser`
- **Functional grouping**: Group by project file functionality
- **Descriptive names**: Names that indicate the parsing capability being tested

## Quality Gates

Each step must pass these gates:
1. **Tests Pass**: All existing functionality preserved
2. **Approval Files**: Correctly renamed and functioning
3. **Naming Convention**: Follows established patterns
4. **AI Testing Codex**: Adheres to documented best practices
5. **Commit Message**: Uses Arlo's Risk-Aware Commit Notation

## Risk Mitigation

- **Backup Strategy**: Original file backed up before changes
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
7. Foundation established for future project file test expansion

## Special Considerations

- **Small File**: Only 1 test and 1 approval file to reorganize
- **Simple Structure**: Basic reorganization focusing on naming consistency
- **Future Expansion**: Structure should accommodate additional project file tests
- **Project File Domain**: Tests involve `.dlproj` file parsing for batch compilation

---

**REMEMBER**: After each step, wait for human confirmation before proceeding to the next step. Update this plan by marking completed steps as `[COMPLETED]`.