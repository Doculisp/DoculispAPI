# Container Test Structure Analysis

## Current State
- **File**: `tests/container.test.ts`
- **Total Tests**: 48 tests
- **Main Describe Block**: `'the registry'`

## Current Test Organization

### 1. Root Level Tests (5 tests)
- `should create a testable version for tests`
- `should throw an exception when building something that has not been registered`
- `should restoreAll replaced modules`
- `should return a list of all registered modules.`
- `should be able to build a default node package`

### 2. `has a register method that` (7 tests)
- `should require a valid name for registration`
- `should register an item and call its function when built`
- `should build dependencies of registered item`
- `should detect recursive dependencies`
- `should call builder function each time the item is built.`
- `should not find multiple common dependencies as circular`
- `should not call the builder function more then once if the registerable claims to be a singleton.`

### 3. `has a registerValue method that` (5 tests)
- `should not allow registering two modules with the same name`
- `should allow for the registration of a value with a name property`
- `should not allow for registration of value without name prop or provided name`
- `should allow value to be registered when given a name parameter.`
- `when given a name parameter and an object with a name it should take the parameter.`

### 4. `has a registerBuilder method that` (6 tests)
- `should call the builder when build is called.`
- `should fail registration if function does not have name and no name is provided.`
- `should register the builder by the name parameter if provided.`
- `should build the dependencies when built`
- `should call the builder function once if it is a singleton.`
- `should call the builder multiple times if not a singleton.`

### 5. `when handling replacement` (7 tests)
- `should not support replacement if not a testable.`
- `should support replacement if it is a testable`
- `should not allow you to replace a module if it is not testable.`
- `should allow you to replace a module if it is testable`
- `should not let you replace a module that has not been registered`
- `should not let you replace a module that has been replaced`
- `should allow you to replace a non singleton with a singleton`
- `should allow the replacement of a singleton with non singleton.`

### 6. `has a restore method that` (2 tests)
- `call original method when replacement is restored.`
- `uses cached value when restored`

### 7. `has a replaceBuilder method that` (5 tests)
- `should replace a module with a builder function`
- `should not allow you to replace using an anonymous function without using the name parameter.`
- `should allow replacement with anonymous function if name is passed`
- `should allow for dependencies on replacement builder`
- `should replace a non singleton with a singleton`

### 8. `has a replaceValue method that` (3 tests)
- `should replace a module with a value`
- `should not allow a replacement with no name attribute or name parameter`
- `should allow replacement of module when name is passed as a parameter`

### 9. `has replacePackageBuilder method that` (4 tests)
- `should replace fs`
- `should not allow replacement of anonymous function if no name is given as a parameter`
- `should allow replacement of anonymous function if name is give as a parameter`
- `should allow for a package to be replaced with a singleton`

### 10. `has replacePackageValue method that` (3 tests)
- `should replace a package with a value.`
- `should not replace a package with value that does not have a name if no name is provided as a parameter.`
- `should allow for a value without a name property if the name is passed as a parameter.`

## Issues Identified

1. **Inconsistent naming**: Mix of "should" style and behavior descriptions
2. **Deep nesting**: Method-focused describe blocks obscure functional grouping
3. **Mixed abstraction levels**: Basic functionality mixed with specific method details
4. **Unclear test scenarios**: Some test names don't clearly indicate what's being tested
5. **Method-focused organization**: Organized by method names rather than functionality

## Target Organization Plan

### New Structure:
```
describe('Dependency Injection Container', () => {
  describe('Basic Container Functionality', () => { ... })      // 5 tests
  describe('Module Registration', () => { ... })                // 7 tests  
  describe('Value Registration', () => { ... })                 // 5 tests
  describe('Builder Registration', () => { ... })               // 6 tests
  describe('Module Replacement', () => { ... })                 // 7 tests
  describe('Module Restoration', () => { ... })                 // 2 tests
  describe('Builder Replacement', () => { ... })                // 5 tests
  describe('Value Replacement', () => { ... })                  // 3 tests
  describe('Package Builder Replacement', () => { ... })        // 4 tests
  describe('Package Value Replacement', () => { ... })          // 3 tests
})
```

Total: 48 tests organized into 10 logical functional groups.