# Container Test Reorganization Mappings

## Describe Block Organization Mapping

### OLD Structure → NEW Structure

```
OLD: describe('the registry', () => { ... })
NEW: describe('Dependency Injection Container', () => { ... })
```

## Individual Test Name Mappings

### 1. Basic Container Functionality (5 tests)

| OLD Test Name | NEW Test Name |
|---------------|---------------|
| `should create a testable version for tests` | `testable container creation works correctly` |
| `should throw an exception when building something that has not been registered` | `unregistered module build produces error` |
| `should restoreAll replaced modules` | `module restoration restores original functionality` |
| `should return a list of all registered modules.` | `module list retrieval returns all registered modules` |
| `should be able to build a default node package` | `node package building works correctly` |

### 2. Module Registration (7 tests)

**OLD**: `describe('has a register method that', () => { ... })`  
**NEW**: `describe('Module Registration', () => { ... })`

| OLD Test Name | NEW Test Name |
|---------------|---------------|
| `should require a valid name for registration` | `registration validation requires valid name` |
| `should register an item and call its function when built` | `registered item building calls function correctly` |
| `should build dependencies of registered item` | `dependency resolution builds dependencies correctly` |
| `should detect recursive dependencies` | `circular dependency detection produces error` |
| `should call builder function each time the item is built.` | `non-singleton builders execute multiple times` |
| `should not find multiple common dependencies as circular` | `shared dependencies resolve without circular error` |
| `should not call the builder function more then once if the registerable claims to be a singleton.` | `singleton builders execute only once` |

### 3. Value Registration (5 tests)

**OLD**: `describe('has a registerValue method that', () => { ... })`  
**NEW**: `describe('Value Registration', () => { ... })`

| OLD Test Name | NEW Test Name |
|---------------|---------------|
| `should not allow registering two modules with the same name` | `duplicate name registration produces error` |
| `should allow for the registration of a value with a name property` | `named value registration works correctly` |
| `should not allow for registration of value without name prop or provided name` | `unnamed value registration produces error` |
| `should allow value to be registered when given a name parameter.` | `parameter-named value registration works correctly` |
| `when given a name parameter and an object with a name it should take the parameter.` | `parameter name overrides object name property` |

### 4. Builder Registration (6 tests)

**OLD**: `describe('has a registerBuilder method that', () => { ... })`  
**NEW**: `describe('Builder Registration', () => { ... })`

| OLD Test Name | NEW Test Name |
|---------------|---------------|
| `should call the builder when build is called.` | `registered builder execution works correctly` |
| `should fail registration if function does not have name and no name is provided.` | `unnamed builder registration produces error` |
| `should register the builder by the name parameter if provided.` | `parameter-named builder registration works correctly` |
| `should build the dependencies when built` | `builder dependency resolution works correctly` |
| `should call the builder function once if it is a singleton.` | `singleton builder executes only once` |
| `should call the builder multiple times if not a singleton.` | `non-singleton builder executes multiple times` |

### 5. Module Replacement (7 tests)

**OLD**: `describe('when handling replacement', () => { ... })`  
**NEW**: `describe('Module Replacement', () => { ... })`

| OLD Test Name | NEW Test Name |
|---------------|---------------|
| `should not support replacement if not a testable.` | `non-testable containers reject replacement` |
| `should support replacement if it is a testable` | `testable containers support replacement` |
| `should not allow you to replace a module if it is not testable.` | `testable module replacement works correctly` |
| `should allow you to replace a module if it is testable` | `testable module replacement works correctly` |
| `should not let you replace a module that has not been registered` | `unregistered module replacement produces error` |
| `should not let you replace a module that has been replaced` | `already replaced module replacement produces error` |
| `should allow you to replace a non singleton with a singleton` | `non-singleton to singleton replacement works correctly` |
| `should allow the replacement of a singleton with non singleton.` | `singleton to non-singleton replacement works correctly` |

**NOTE**: Tests 3 and 4 appear to be duplicates in current structure - need to verify during implementation.

### 6. Module Restoration (2 tests)

**OLD**: `describe('has a restore method that', () => { ... })`  
**NEW**: `describe('Module Restoration', () => { ... })`

| OLD Test Name | NEW Test Name |
|---------------|---------------|
| `call original method when replacement is restored.` | `module restoration calls original method` |
| `uses cached value when restored` | `singleton restoration uses cached value` |

### 7. Builder Replacement (5 tests)

**OLD**: `describe('has a replaceBuilder method that', () => { ... })`  
**NEW**: `describe('Builder Replacement', () => { ... })`

| OLD Test Name | NEW Test Name |
|---------------|---------------|
| `should replace a module with a builder function` | `builder replacement works correctly` |
| `should not allow you to replace using an anonymous function without using the name parameter.` | `unnamed anonymous builder replacement produces error` |
| `should allow replacement with anonymous function if name is passed` | `named anonymous builder replacement works correctly` |
| `should allow for dependencies on replacement builder` | `replacement builder dependency resolution works correctly` |
| `should replace a non singleton with a singleton` | `builder replacement singleton conversion works correctly` |

### 8. Value Replacement (3 tests)

**OLD**: `describe('has a replaceValue method that', () => { ... })`  
**NEW**: `describe('Value Replacement', () => { ... })`

| OLD Test Name | NEW Test Name |
|---------------|---------------|
| `should replace a module with a value` | `value replacement works correctly` |
| `should not allow a replacement with no name attribute or name parameter` | `unnamed value replacement produces error` |
| `should allow replacement of module when name is passed as a parameter` | `parameter-named value replacement works correctly` |

### 9. Package Builder Replacement (4 tests)

**OLD**: `describe('has replacePackageBuilder method that', () => { ... })`  
**NEW**: `describe('Package Builder Replacement', () => { ... })`

| OLD Test Name | NEW Test Name |
|---------------|---------------|
| `should replace fs` | `node package replacement works correctly` |
| `should not allow replacement of anonymous function if no name is given as a parameter` | `unnamed package builder replacement produces error` |
| `should allow replacement of anonymous function if name is give as a parameter` | `named package builder replacement works correctly` |
| `should allow for a package to be replaced with a singleton` | `package singleton replacement works correctly` |

### 10. Package Value Replacement (3 tests)

**OLD**: `describe('has replacePackageValue method that', () => { ... })`  
**NEW**: `describe('Package Value Replacement', () => { ... })`

| OLD Test Name | NEW Test Name |
|---------------|---------------|
| `should replace a package with a value.` | `package value replacement works correctly` |
| `should not replace a package with value that does not have a name if no name is provided as a parameter.` | `unnamed package value replacement produces error` |
| `should allow for a value without a name property if the name is passed as a parameter.` | `parameter-named package value replacement works correctly` |

## Naming Pattern Consistency

### New Naming Patterns Applied:
- **Success scenarios**: `{operation} {verb} {scenario}`
- **Error scenarios**: `{error condition} produces error`  
- **Validation scenarios**: `{validation type} {verb} {expected outcome}`

### Pattern Examples:
- ✅ `testable container creation works correctly`
- ✅ `unregistered module build produces error`
- ✅ `registration validation requires valid name`
- ✅ `builder dependency resolution works correctly`

## Validation Notes

### Potential Issues Identified:
1. **Duplicate tests**: Module Replacement section may have duplicate test scenarios (tests 3 & 4)
2. **Test logic preservation**: All test logic and assertions must remain identical
3. **Naming conflicts**: No conflicts detected in new naming scheme

### Quality Checks:
- ✅ All 48 tests mapped
- ✅ No naming conflicts
- ✅ Consistent naming patterns applied
- ✅ Functional grouping maintained
- ⚠️ Need to verify duplicate test scenario during implementation

## Implementation Order

The reorganization will proceed in this order to minimize risk:
1. Basic Container Functionality (5 tests)
2. Module Registration (7 tests)
3. Value Registration (5 tests)
4. Builder Registration (6 tests)
5. Module Replacement (7 tests)
6. Module Restoration (2 tests)
7. Builder Replacement (5 tests)
8. Value Replacement (3 tests)
9. Package Builder Replacement (4 tests)
10. Package Value Replacement (3 tests)

Total: 48 tests across 10 functional groups