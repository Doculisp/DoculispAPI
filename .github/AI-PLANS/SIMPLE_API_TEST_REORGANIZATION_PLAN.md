# Simple API Test Reorganization Plan

## Overview

This plan provides a systematic approach to reorganize and rename the `simple-api.test.ts` file to follow modern testing conventions and improve maintainability. The reorganization will align with the AI Testing Codex principles while maintaining all existing functionality. This test file covers the simplified DoculispApi public interface focusing on initialization and basic component access.

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

**Correct Commands:**
- Run specific test file: `npx jest --testPathPattern=filename`
- Run all tests: `npx jest`
- Run tests with watch mode: `npx jest --watch`

**DO NOT USE:** `npm test -- --testPathPattern=filename` (this will not work correctly)

## Periodic Re-reading Requirements

**MANDATORY**: The copilot MUST re-read the following documents at these intervals:
1. **After every 2-3 test reorganizations**: Re-read this plan and the AI Testing Codex
2. **When summarizing the conversation**: Re-read this plan, AI Testing Codex, and any relevant AI Assistant Codex sections
3. **After any extended pause or context switch**: Re-read all prerequisite documents
4. **Before starting each major reorganization phase**: Re-read relevant sections of this plan
5. **When encountering uncertainty or inconsistency**: Stop and re-read the appropriate codex documents

## Current State Analysis

The current `simple-api.test.ts` has these issues:
- Inconsistent test naming mixing "should" descriptions with behavior descriptions
- Test grouping mixes initialization concerns with component functionality
- Non-descriptive test names that don't clearly indicate the scenario being tested
- Repetitive component access tests that could be better organized
- Standard Jest expectations rather than approval testing patterns

## Target State

After reorganization:
- Clear, descriptive test names following sentence structure with spaces
- Logical test grouping by functionality rather than mixed concerns
- Consistent naming conventions throughout
- Better separation between API initialization and component functionality tests
- Improved readability and maintainability

## Reorganization Steps

### Phase 1: Setup and Preparation

#### Step 1: Create Backup and Analyze Current Structure
- [ ] **[PENDING]** Create backup of current test file
- [ ] **[PENDING]** Document current test structure and naming patterns
- [ ] **[PENDING]** Commit backup with message: `". d Creates backup before simple API test reorganization"`

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

#### Step 3: Reorganize API Initialization Tests
- [ ] **[PENDING]** Rename API initialization tests under `describe('API Initialization')`
- [ ] **[PENDING]** Use pattern: `{component} {verb} {scenario}`
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should create API instance successfully` → `API instance creates successfully`

**Expected Outcomes**:
- 1 initialization test renamed
- Tests passing
- Commit created

#### Step 4: Reorganize Component Access Tests  
- [ ] **[PENDING]** Rename component access tests under `describe('Component Access')`
- [ ] **[PENDING]** Use pattern: `{component} access {verb} {scenario}`
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should provide access to utility methods` → `utility methods access provides functionality`
- `should provide access to path constructor` → `path constructor access provides functionality`
- `should provide access to variable table factory` → `variable table factory access provides functionality`
- `should provide access to AST builder` → `AST builder access provides functionality`
- `should provide access to string writer` → `string writer access provides functionality`

**Expected Outcomes**:
- 5 component access tests renamed
- Tests passing
- Commit created

#### Step 5: Reorganize Path Constructor Functionality Tests
- [ ] **[PENDING]** Rename path constructor tests under `describe('Path Constructor Functionality')`
- [ ] **[PENDING]** Use pattern: `{operation} {verb} {scenario}`
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should construct paths correctly` → `path construction creates valid paths`

**Expected Outcomes**:
- 1 path constructor test renamed
- Tests passing
- Commit created

#### Step 6: Reorganize Util Functionality Tests
- [ ] **[PENDING]** Rename util functionality tests under `describe('Util Functionality')`
- [ ] **[PENDING]** Use pattern: `{operation} {verb} {scenario}`
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should create success results` → `success result creation works correctly`
- `should create failure results` → `failure result creation works correctly`

**Expected Outcomes**:
- 2 util functionality tests renamed
- Tests passing
- Commit created

### Phase 3: Test Structure Modernization

#### Step 7: Update Test Structure and Imports
- [ ] **[PENDING]** Reorganize describe blocks to match new test categories
- [ ] **[PENDING]** Ensure all imports follow AI Testing Codex patterns
- [ ] **[PENDING]** Add JSDoc comments for major test groups
- [ ] **[PENDING]** Run tests and commit if passing

**Expected Changes**:
```typescript
// Old structure
describe('Simple Doculisp API', () => {
  describe('API initialization', () => { ... })
  describe('path constructor functionality', () => { ... })
  describe('util functionality', () => { ... })
})

// New structure  
describe('Simple Doculisp API', () => {
  describe('API Initialization', () => { ... })
  describe('Component Access', () => { ... })
  describe('Path Constructor Functionality', () => { ... })
  describe('Util Functionality', () => { ... })
})
```

**Expected Outcomes**:
- Modernized test structure
- Clear test organization
- Tests passing
- Commit created

#### Step 8: Apply AI Testing Codex Patterns
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

#### Step 9: Final Test Execution and Cleanup
- [ ] **[PENDING]** Run complete test suite to ensure all tests pass
- [ ] **[PENDING]** Verify all test naming is consistent
- [ ] **[PENDING]** Update any test documentation or comments
- [ ] **[PENDING]** Final commit with comprehensive changes

**Expected Outcomes**:
- All tests passing
- Clean test structure
- Final commit created

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
- **API initialization**: `{component} {verb} {scenario}`
- **Component access**: `{component} access {verb} {scenario}`
- **Functionality testing**: `{operation} {verb} {scenario}`
- **Structure**: Use sentence structure with spaces (noun verb pattern)

### Describe Blocks
- **Functional grouping**: Group by operation type and component responsibility
- **Clear hierarchy**: API Initialization → Component Access → Specific Functionality
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