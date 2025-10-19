# API Test Reorganization Plan

## Overview

This plan provides a systematic approach to reorganize and rename the `api.test.ts` file to follow modern testing conventions and improve maintainability. The reorganization will align with the AI Testing Codex principles while maintaining all existing functionality. This test file covers the main DoculispApi public interface and its integration with project files.

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
4. **Approval file tracking**: This test file uses standard Jest expectations, no approval files to rename

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

The current `api.test.ts` has these issues:
- Inconsistent test naming mixing "should" descriptions with behavior descriptions
- Test grouping uses method names rather than functional categories
- Non-descriptive test names that don't clearly indicate the scenario being tested
- Mixed abstraction levels in test organization
- Standard Jest expectations rather than approval testing patterns

## Target State

After reorganization:
- Clear, descriptive test names following sentence structure with spaces
- Logical test grouping by functionality rather than API method names
- Consistent naming conventions throughout
- Better separation of concerns between test categories
- Improved readability and maintainability

## Reorganization Steps

### Phase 1: Setup and Preparation

#### Step 1: Create Backup and Analyze Current Structure
- [ ] **[PENDING]** Create backup of current test file
- [ ] **[PENDING]** Document current test structure and naming patterns
- [ ] **[PENDING]** Commit backup with message: `". d Creates backup before API test reorganization"`

**Expected Outcomes**: 
- Backup file created
- Current state documented
- Safe starting point established

#### Step 2: Plan Test Name Mappings
- [ ] **[PENDING]** Create mapping document showing old test names → new test names
- [ ] **[PENDING]** Create mapping document showing old describe blocks → new organization
- [ ] **[PENDING]** Validate no naming conflicts exist

**Expected Outcomes**:
- Complete rename mapping documented
- No conflicts identified
- Clear path forward established

### Phase 2: Core Test Structure Reorganization

#### Step 3: Reorganize File Testing Methods
- [ ] **[PENDING]** Rename file testing tests under `describe('File Operations')`
- [ ] **[PENDING]** Use pattern: `{operation} {verb} {scenario}`
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should handle .dlproj files without throwing Unknown identifier errors` → `dlproj file testing validates successfully`
- `should validate file extensions` → `invalid file extensions produce error`
- `should return validation results for .dlproj files` → `dlproj file validation returns success results`

**Expected Outcomes**:
- 3 file testing tests renamed
- Tests passing
- Commit created

#### Step 4: Reorganize File Compilation Methods
- [ ] **[PENDING]** Rename compilation tests under `describe('File Compilation')`
- [ ] **[PENDING]** Use pattern: `{operation} {verb} {scenario}`
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should handle .dlproj files successfully` → `dlproj file compilation completes successfully`

**Expected Outcomes**:
- 1 compilation test renamed
- Tests passing
- Commit created

#### Step 5: Reorganize Utility Access Methods
- [ ] **[PENDING]** Rename utility tests under `describe('Component Access')`
- [ ] **[PENDING]** Use pattern: `{component} access {verb} {scenario}`
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should provide access to AST builder` → `AST builder access provides functionality`
- `should provide access to string writer` → `string writer access provides functionality`
- `should provide access to variable table factory` → `variable table factory access provides functionality`
- `should provide access to path constructor` → `path constructor access provides functionality`
- `should provide access to util functions` → `util functions access provides functionality`

**Expected Outcomes**:
- 5 utility access tests renamed
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
describe('Doculisp API', () => {
  describe('testFile method', () => { ... })
  describe('compileFile method', () => { ... })
  describe('utility methods', () => { ... })
})

// New structure  
describe('Doculisp API', () => {
  describe('File Operations', () => { ... })
  describe('File Compilation', () => { ... })
  describe('Component Access', () => { ... })
})
```

**Expected Outcomes**:
- Modernized test structure
- Clear test organization
- Tests passing
- Commit created

#### Step 7: Apply AI Testing Codex Patterns
- [ ] **[PENDING]** Ensure all test setup follows the AI Testing Codex builder patterns where applicable
- [ ] **[PENDING]** Standardize variable naming conventions
- [ ] **[PENDING]** Add appropriate JSDoc comments for test groups
- [ ] **[PENDING]** Run tests and commit if passing

**Expected Outcomes**:
- Consistent with AI Testing Codex where applicable
- Standardized variable names
- Better documentation
- Tests passing
- Commit created

### Phase 4: Final Validation and Cleanup

#### Step 8: Final Test Execution and Cleanup
- [ ] **[PENDING]** Run complete test suite to ensure all tests pass
- [ ] **[PENDING]** Verify all test naming is consistent
- [ ] **[PENDING]** Update any test documentation or comments
- [ ] **[PENDING]** Final commit with comprehensive changes

**Expected Outcomes**:
- All tests passing
- Clean test structure
- Final commit created

#### Step 9: Cleanup Backup Files
- [ ] **[PENDING]** Delete backup files created during reorganization
- [ ] **[PENDING]** Remove any temporary files or directories created during process
- [ ] **[PENDING]** Verify no backup files remain in working directory
- [ ] **[PENDING]** Commit cleanup with message: `". d Removes backup files after API test reorganization"`

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

## File Naming Conventions

### Test Names
- **File operations**: `{file type} {operation} {verb} {scenario}`
- **Component access**: `{component} access {verb} {scenario}`
- **Error handling**: `{error condition} produces error`
- **Structure**: Use sentence structure with spaces (noun verb pattern)

### Describe Blocks
- **Functional grouping**: Group by operation type rather than API method names
- **Clear hierarchy**: File Operations → File Compilation → Component Access
- **Descriptive names**: Names that indicate the category of functionality

## Quality Gates

Each step must pass these gates:
1. **Tests Pass**: All existing functionality preserved
2. **Naming Convention**: Follows established patterns
3. **AI Testing Codex**: Adheres to documented best practices where applicable
4. **Commit Message**: Uses Arlo's Risk-Aware Commit Notation

## Risk Mitigation

- **Backup Strategy**: Original file backed up before changes
- **Incremental Changes**: Small, testable changes with immediate validation
- **Rollback Plan**: Can revert to backup if any step fails
- **Test Validation**: Each step must pass tests before proceeding

## Success Criteria

The reorganization is complete when:
1. All existing tests pass with new names
2. Test structure follows modern conventions
3. Naming conventions are consistent throughout
4. No regression in functionality
5. Improved readability and maintainability

---

**REMEMBER**: After each step, wait for human confirmation before proceeding to the next step. Update this plan by marking completed steps as `[COMPLETED]`.