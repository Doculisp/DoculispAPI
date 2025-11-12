# Controller Test Mappings

## Test Name Mappings

### Test Method Tests (3 tests):
1. `should test handle a successful file` → `successful file processing completes correctly`
2. `should fail a file that cannot parse an ast` → `ast parsing failure returns error`
3. `should fail a file that cannot be converted to markdown` → `markdown conversion failure returns error`

### Compile Method Tests (7 tests):
1. `should be successful if everything is successful` → `successful compilation completes correctly`
2. `should fail if a file cannot parse an ast` → `ast parsing failure returns error`
3. `should fail a file that cannot be converted to markdown` → `markdown conversion failure returns error`
4. `should fail if writing the file fails` → `file writing failure returns error`
5. `should fail with standardized error when non-project file has no destination` → `missing destination path produces validation error`
6. `should fail with standardized error when project file has destination path` → `project file with destination produces validation error`

### Validation Error Tests (moved from "test validation errors"):
1. `should fail with standardized error when no source file is given` → `missing source file produces validation error`

## Approval File Name Mappings

### Test Method Approval Files (3 files):
1. `controller.test.controller_test_should_test_handle_a_successful_file.approved.json`
   → `controller.test.test_method_successful_file_processing_completes_correctly.approved.json`

2. `controller.test.controller_test_should_fail_a_file_that_cannot_parse_an_ast.approved.json`
   → `controller.test.test_method_ast_parsing_failure_returns_error.approved.json`

3. `controller.test.controller_test_should_fail_a_file_that_cannot_be_converted_to_markdown.approved.json`
   → `controller.test.test_method_markdown_conversion_failure_returns_error.approved.json`

### Compile Method Approval Files (4 files):
1. `controller.test.controller_compile_should_be_successful_if_everything_is_successful.approved.json`
   → `controller.test.compile_method_successful_compilation_completes_correctly.approved.json`

2. `controller.test.controller_compile_should_fail_if_a_file_cannot_parse_an_ast.approved.json`
   → `controller.test.compile_method_ast_parsing_failure_returns_error.approved.json`

3. `controller.test.controller_compile_should_fail_a_file_that_cannot_be_converted_to_markdown.approved.json`
   → `controller.test.compile_method_markdown_conversion_failure_returns_error.approved.json`

4. `controller.test.controller_compile_should_fail_if_writing_the_file_fails.approved.json`
   → `controller.test.compile_method_file_writing_failure_returns_error.approved.json`

### Validation Error Approval Files (0 files):
- No approval files for validation tests (they use direct assertions)

## Describe Block Changes

### Current → New Describe Structure:
```
OLD:
describe('controller')
├── describe('test')
├── describe('compile')
└── describe('test validation errors')

NEW:
describe('Controller')
├── describe('Test Method')
├── describe('Compile Method')
└── describe('Validation Errors')
```

## Validation Notes:
- No naming conflicts identified
- All approval files have clear mappings
- Validation error tests moved to unified "Validation Errors" block
- Modern naming conventions applied throughout