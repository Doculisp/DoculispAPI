# Container Test Reorganization Plan

## Overview

This plan provides a systematic approach to reorganize and rename the `container.test.ts` file to follow modern testing conventions and improve maintainability. The reorganization will align with the AI Testing Codex principles while maintaining all existing functionality. This test file covers the dependency injection container system that is core to the project's testing architecture.

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

## Periodic Re-reading Requirements

**MANDATORY**: The copilot MUST re-read the following documents at these intervals:
1. **After every 2-3 test reorganizations**: Re-read this plan and the AI Testing Codex
2. **When summarizing the conversation**: Re-read this plan, AI Testing Codex, and any relevant AI Assistant Codex sections
3. **After any extended pause or context switch**: Re-read all prerequisite documents
4. **Before starting each major reorganization phase**: Re-read relevant sections of this plan
5. **When encountering uncertainty or inconsistency**: Stop and re-read the appropriate codex documents

## Current State Analysis

The current `container.test.ts` has these issues:
- Inconsistent test naming mixing "should" descriptions with behavior descriptions  
- Deep nesting of describe blocks that obscures test organization
- Test names that don't clearly indicate the scenario being tested
- Mixed abstraction levels between container functionality and specific methods
- Very large file with 50+ tests that could benefit from better categorization

## Target State

After reorganization:
- Clear, descriptive test names following sentence structure with spaces
- Logical test grouping by functional areas rather than method names
- Consistent naming conventions throughout
- Better separation of concerns between different container capabilities
- Improved readability and maintainability of this critical infrastructure test

## Reorganization Steps

### Phase 1: Setup and Preparation

#### Step 1: Create Backup and Analyze Current Structure
- [ ] **[PENDING]** Create backup of current test file
- [ ] **[PENDING]** Document current test structure and count (50+ tests)
- [ ] **[PENDING]** Analyze test categories and groupings
- [ ] **[PENDING]** Commit backup with message: `". d Creates backup before container test reorganization"`

**Expected Outcomes**: 
- Backup file created
- Current state documented
- Test categories identified

#### Step 2: Plan Test Name Mappings
- [ ] **[PENDING]** Create mapping document showing old test names → new test names
- [ ] **[PENDING]** Create mapping document showing old describe blocks → new organization
- [ ] **[PENDING]** Validate no naming conflicts exist

**Expected Outcomes**:
- Complete rename mapping documented
- No conflicts identified
- Clear reorganization path established

### Phase 2: Core Test Structure Reorganization

#### Step 3: Reorganize Basic Container Functionality Tests
- [ ] **[PENDING]** Rename basic container tests under `describe('Basic Container Functionality')`
- [ ] **[PENDING]** Use pattern: `{operation} {verb} {scenario}`
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should create a testable version for tests` → `testable container creation works correctly`
- `should throw an exception when building something that has not been registered` → `unregistered module build produces error`
- `should restoreAll replaced modules` → `module restoration restores original functionality`
- `should return a list of all registered modules` → `module list retrieval returns all registered modules`
- `should be able to build a default node package` → `node package building works correctly`

**Expected Outcomes**:
- 5 basic functionality tests renamed
- Tests passing
- Commit created

#### Step 4: Reorganize Registration Method Tests
- [ ] **[PENDING]** Rename registration tests under `describe('Module Registration')`
- [ ] **[PENDING]** Use pattern: `{registration type} {verb} {scenario}`
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should require a valid name for registration` → `registration validation requires valid name`
- `should register an item and call its function when built` → `registered item building calls function correctly`
- `should build dependencies of registered item` → `dependency resolution builds dependencies correctly`
- `should detect recursive dependencies` → `circular dependency detection produces error`
- `should call builder function each time the item is built` → `non-singleton builders execute multiple times`
- `should not find multiple common dependencies as circular` → `shared dependencies resolve without circular error`
- `should not call the builder function more then once if the registerable claims to be a singleton` → `singleton builders execute only once`

**Expected Outcomes**:
- 7 registration tests renamed
- Tests passing
- Commit created

#### Step 5: Reorganize Value Registration Tests
- [ ] **[PENDING]** Rename value registration tests under `describe('Value Registration')`
- [ ] **[PENDING]** Use pattern: `{value registration} {verb} {scenario}`
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should not allow registering two modules with the same name` → `duplicate name registration produces error`
- `should allow for the registration of a value with a name property` → `named value registration works correctly`
- `should not allow for registration of value without name prop or provided name` → `unnamed value registration produces error`
- `should allow value to be registered when given a name parameter` → `parameter-named value registration works correctly`
- `when given a name parameter and an object with a name it should take the parameter` → `parameter name overrides object name property`

**Expected Outcomes**:
- 5 value registration tests renamed
- Tests passing
- Commit created

#### Step 6: Reorganize Builder Registration Tests
- [ ] **[PENDING]** Rename builder registration tests under `describe('Builder Registration')`
- [ ] **[PENDING]** Use pattern: `{builder registration} {verb} {scenario}`
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should call the builder when build is called` → `registered builder execution works correctly`
- `should fail registration if function does not have name and no name is provided` → `unnamed builder registration produces error`
- `should register the builder by the name parameter if provided` → `parameter-named builder registration works correctly`
- `should build the dependencies when built` → `builder dependency resolution works correctly`
- `should call the builder function once if it is a singleton` → `singleton builder executes only once`
- `should call the builder multiple times if not a singleton` → `non-singleton builder executes multiple times`

**Expected Outcomes**:
- 6 builder registration tests renamed
- Tests passing
- Commit created

#### Step 7: Reorganize Replacement Functionality Tests
- [ ] **[PENDING]** Rename replacement tests under `describe('Module Replacement')`
- [ ] **[PENDING]** Use pattern: `{replacement operation} {verb} {scenario}`
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should not support replacement if not a testable` → `non-testable containers reject replacement`
- `should support replacement if it is a testable` → `testable containers support replacement`
- `should allow you to replace a module if it is testable` → `testable module replacement works correctly`
- `should not let you replace a module that has not been registered` → `unregistered module replacement produces error`
- `should not let you replace a module that has been replaced` → `already replaced module replacement produces error`
- `should allow you to replace a non singleton with a singleton` → `non-singleton to singleton replacement works correctly`
- `should allow the replacement of a singleton with non singleton` → `singleton to non-singleton replacement works correctly`

**Expected Outcomes**:
- 7 replacement tests renamed
- Tests passing
- Commit created

#### Step 8: Reorganize Restore Functionality Tests
- [ ] **[PENDING]** Rename restore tests under `describe('Module Restoration')`
- [ ] **[PENDING]** Use pattern: `{restoration operation} {verb} {scenario}`
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `call original method when replacement is restored` → `module restoration calls original method`
- `uses cached value when restored` → `singleton restoration uses cached value`

**Expected Outcomes**:
- 2 restoration tests renamed
- Tests passing
- Commit created

#### Step 9: Reorganize Builder Replacement Tests
- [ ] **[PENDING]** Rename builder replacement tests under `describe('Builder Replacement')`
- [ ] **[PENDING]** Use pattern: `{builder replacement} {verb} {scenario}`
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should replace a module with a builder function` → `builder replacement works correctly`
- `should not allow you to replace using an anonymous function without using the name parameter` → `unnamed anonymous builder replacement produces error`
- `should allow replacement with anonymous function if name is passed` → `named anonymous builder replacement works correctly`
- `should allow for dependencies on replacement builder` → `replacement builder dependency resolution works correctly`
- `should replace a non singleton with a singleton` → `builder replacement singleton conversion works correctly`

**Expected Outcomes**:
- 5 builder replacement tests renamed
- Tests passing
- Commit created

#### Step 10: Reorganize Value Replacement Tests
- [ ] **[PENDING]** Rename value replacement tests under `describe('Value Replacement')`
- [ ] **[PENDING]** Use pattern: `{value replacement} {verb} {scenario}`
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should replace a module with a value` → `value replacement works correctly`
- `should not allow a replacement with no name attribute or name parameter` → `unnamed value replacement produces error`
- `should allow replacement of module when name is passed as a parameter` → `parameter-named value replacement works correctly`

**Expected Outcomes**:
- 3 value replacement tests renamed
- Tests passing
- Commit created

#### Step 11: Reorganize Package Builder Replacement Tests
- [ ] **[PENDING]** Rename package builder replacement tests under `describe('Package Builder Replacement')`
- [ ] **[PENDING]** Use pattern: `{package replacement} {verb} {scenario}`
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should replace fs` → `node package replacement works correctly`
- `should not allow replacement of anonymous function if no name is given as a parameter` → `unnamed package builder replacement produces error`
- `should allow replacement of anonymous function if name is give as a parameter` → `named package builder replacement works correctly`
- `should allow for a package to be replaced with a singleton` → `package singleton replacement works correctly`

**Expected Outcomes**:
- 4 package builder replacement tests renamed
- Tests passing
- Commit created

#### Step 12: Reorganize Package Value Replacement Tests
- [ ] **[PENDING]** Rename package value replacement tests under `describe('Package Value Replacement')`
- [ ] **[PENDING]** Use pattern: `{package value replacement} {verb} {scenario}`
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should replace a package with a value` → `package value replacement works correctly`
- `should not replace a package with value that does not have a name if no name is provided as a parameter` → `unnamed package value replacement produces error`
- `should allow for a value without a name property if the name is passed as a parameter` → `parameter-named package value replacement works correctly`

**Expected Outcomes**:
- 3 package value replacement tests renamed
- Tests passing
- Commit created

### Phase 3: Test Structure Modernization

#### Step 13: Update Test Structure and Imports
- [ ] **[PENDING]** Reorganize describe blocks to match new test categories
- [ ] **[PENDING]** Ensure all imports follow AI Testing Codex patterns
- [ ] **[PENDING]** Add JSDoc comments for major test groups
- [ ] **[PENDING]** Run tests and commit if passing

**Expected Changes**:
```typescript
// Old structure
describe('the registry', () => {
  describe('has a register method that', () => { ... })
  describe('has a registerValue method that', () => { ... })
  describe('has a registerBuilder method that', () => { ... })
  describe('when handling replacement', () => { ... })
  // etc.
})

// New structure  
describe('Dependency Injection Container', () => {
  describe('Basic Container Functionality', () => { ... })
  describe('Module Registration', () => { ... })
  describe('Value Registration', () => { ... })
  describe('Builder Registration', () => { ... })
  describe('Module Replacement', () => { ... })
  describe('Module Restoration', () => { ... })
  describe('Builder Replacement', () => { ... })
  describe('Value Replacement', () => { ... })
  describe('Package Builder Replacement', () => { ... })
  describe('Package Value Replacement', () => { ... })
})
```

**Expected Outcomes**:
- Modernized test structure
- Clear functional organization
- Tests passing
- Commit created

#### Step 14: Apply AI Testing Codex Patterns
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

#### Step 15: Final Test Execution and Cleanup
- [ ] **[PENDING]** Run complete test suite to ensure all tests pass
- [ ] **[PENDING]** Verify all test naming is consistent (50+ tests)
- [ ] **[PENDING]** Update any test documentation or comments
- [ ] **[PENDING]** Final commit with comprehensive changes

**Expected Outcomes**:
- All tests passing
- Clean test structure
- Final commit created

#### Step 16: Plan Completion and Documentation
- [ ] **[PENDING]** Mark this plan as `[COMPLETED]`
- [ ] **[PENDING]** Document any deviations or lessons learned
- [ ] **[PENDING]** Provide summary of changes made

**Expected Outcomes**:
- Plan marked complete
- Summary documentation created
- Reorganization fully documented

## File Naming Conventions

### Test Names
- **Basic functionality**: `{operation} {verb} {scenario}`
- **Registration operations**: `{registration type} {verb} {scenario}`
- **Replacement operations**: `{replacement operation} {verb} {scenario}`
- **Error handling**: `{error condition} produces error`
- **Structure**: Use sentence structure with spaces (noun verb pattern)

### Describe Blocks
- **Functional grouping**: Group by container capability rather than method names
- **Clear hierarchy**: Basic → Registration → Replacement → Restoration
- **Descriptive names**: Names that indicate the functional area being tested

## Quality Gates

Each step must pass these gates:
1. **Tests Pass**: All existing functionality preserved (50+ tests)
2. **Naming Convention**: Follows established patterns
3. **AI Testing Codex**: Adheres to documented best practices where applicable
4. **Clear Organization**: Tests are logically grouped by functionality
5. **Commit Message**: Uses Arlo's Risk-Aware Commit Notation

## Risk Mitigation

- **Backup Strategy**: Original file backed up before changes
- **Incremental Changes**: Small, testable changes with immediate validation
- **Large Test Count**: Special attention to maintaining all 50+ tests
- **Critical Infrastructure**: Container system is core to testing architecture
- **Test Validation**: Each step must pass tests before proceeding

## Success Criteria

The reorganization is complete when:
1. All existing tests pass with new names (50+ tests)
2. Test structure follows modern conventions
3. Naming conventions are consistent throughout
4. No regression in functionality
5. Improved readability and maintainability
6. Clear separation between different container capabilities

---

**REMEMBER**: After each step, wait for human confirmation before proceeding to the next step. Update this plan by marking completed steps as `[COMPLETED]`. This is a large test file with critical infrastructure, so extra care should be taken.