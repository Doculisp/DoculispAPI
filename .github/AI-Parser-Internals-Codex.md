# AI Parser Internals Codex

This codex provides comprehensive documentation for the Doculisp parser internals system, including the generic parser architecture, handler patterns, result types, and implementation details.

## Overview

The parser internals system (`internals.ts`) provides the foundational parsing infrastructure used throughout the Doculisp processing pipeline. It implements a **generic, composable parser architecture** that allows different parsing stages to be built using consistent patterns and result types.

## Core Architecture

### Parser System Philosophy

The parser system is built on these principles:

1. **Composition Over Inheritance**: Parsers are built by composing handler functions
2. **Generic Input/Output**: Parsers work with any input type `TParse` and result type `TResult`
3. **Location Tracking**: Every parsing operation maintains precise location information
4. **Result Propagation**: Consistent error handling through `Result<T>` types
5. **Handler Chain**: Multiple handlers attempt parsing in sequence until one succeeds

### Main Components

```typescript
interface IInternals {
    noResultFound(): ISuccess<false>;
    stopFindingResults(): ISuccess<'stop'>;
    buildStepParse<TParse, TResult>(step, resultType): StepParse<TParse, TResult>;
    createArrayParser<TParse, TResult>(...handlers): IParser<TParse[], TResult>;
    createStringParser<T>(...handlers): IParser<string, T>;
}
```

## Data Structure Types

### Core Parsing Types

#### IParseStepForward\<TParse>
```typescript
interface IParseStepForward<TParse> extends IParseRemaining<TParse> {
    readonly location: ILocation;
}
```
- Represents progress through parsing input
- Maintains location tracking for error reporting
- Contains remaining unparsed input

#### Result Discrimination Types

**ISubParseResult\<T>** - Single Result:
```typescript
interface ISubParseResult<T> {
    readonly subResult: T;
    readonly type: 'parse result';
}
```

**ISubParseGroupResult\<T>** - Multiple Results:
```typescript
interface ISubParseGroupResult<T> {
    readonly subResult: (IKeeper<T> | IDiscardResult)[];
    readonly type: 'parse group result';
}
```

**IDiscardResult** - No Result:
```typescript
interface IDiscardResult { 
    readonly type: 'discard';
}
```

#### Handler Return Types

**StepParseResult\<TParse, TResult>**:
```typescript
type StepParseResult<TParse, TResult> = Result<StepParse<TParse, TResult> | false | 'stop'>;
```

Three possible return values:
- **`StepParse<TParse, TResult>`**: Successful parsing with result
- **`false`**: No match found, try next handler
- **`'stop'`**: Stop parsing (used for early termination)

### Handler Function Signature

```typescript
type HandleValue<TParse, TResult> = (
    input: TParse, 
    current: ILocation
) => StepParseResult<TParse, TResult>;
```

All parser handlers follow this signature:
- **Input**: Current input to parse + location
- **Output**: Result indicating success/failure/continuation

## Parser Implementation

### Generic Parser Class

The `Parser<TParse, TResult>` class implements the core parsing logic:

#### Constructor Parameters
```typescript
constructor(
    util: IUtil,
    internals: IInternals,
    needsParsing: (input: TParse) => boolean,
    ...handlers: HandleValue<TParse, TResult>[]
)
```

#### Key Features

1. **Handler Chain Execution**: Tries handlers in sequence via `mapFirst()`
2. **Continuation Logic**: Continues parsing while `needsParsing()` returns true
3. **Result Accumulation**: Collects successful parse results into array
4. **Location Tracking**: Updates location after each successful parse
5. **Early Termination**: Supports 'stop' signal to halt parsing

### Parse Method Logic

```typescript
parse(input: TParse, initialLocation: ILocation): Result<[TResult[], IUnparsed<TParse>]>
```

#### Processing Flow

1. **Initialize**: Set up result collection and current location
2. **Parse Loop**: While input needs parsing:
   - Try each handler via `mapFirst()`
   - Handle result types (discard, parse result, group result)
   - Update location and remaining input
   - Accumulate results
3. **Return**: Array of results + unparsed remainder

#### Result Type Handling

```typescript
if(parseResult.type === 'parse result'){
    results[results.length] = parseResult.subResult;
}
if(parseResult.type === 'parse group result') {
    parseResult.subResult.forEach(t =>{
        if(t.type === 'keep'){
            results[results.length] = t.keptValue;
        }
    });
}
// 'discard' type results are ignored
```

## Handler Chain Logic

### mapFirst Function

```typescript
function mapFirst<TParse, TResult>(
    internals: IInternals, 
    input: TParse, 
    current: ILocation, 
    collection: HandleValue<TParse, TResult>[]
): StepParseResult<TParse, TResult>
```

#### Algorithm

1. **Sequential Trial**: Try each handler in order
2. **Success Handling**: Return first successful result
3. **Failure Propagation**: Return first error encountered
4. **No Match**: Return 'stop' if no handler matches

#### Handler Result Processing

- **Success with value**: Return the successful result
- **Success without value (false)**: Try next handler
- **Error**: Immediately propagate error
- **All handlers fail**: Return 'stop'

## Specialized Parser Factories

### String Parser Factory

```typescript
function createStringParser<T>(...handlers: HandleStringValue<T>[]): IParser<string, T> {
    return new Parser<string, T>(
        util, 
        internals, 
        (input: string) => (0 < input.length), 
        ...handlers
    );
}
```

**Features**:
- **Continuation Logic**: Parses while string has characters
- **String-Specific**: Optimized for character-by-character parsing
- **Location Updates**: Handles line/character position tracking

### Array Parser Factory

```typescript
function createArrayParser<TParse, TResult>(...handlers): IParser<TParse[], TResult> {
    return new Parser<TParse[], TResult>(
        util,
        internals, 
        (input: TParse[]) => (0 < input.length),
        ...handlers
    );
}
```

**Features**:
- **Element Processing**: Parses while array has elements
- **Generic Elements**: Works with any array element type
- **Sequential Processing**: Processes elements in order

## Utility Functions

### Result Creation Helpers

**noResultFound()**:
```typescript
function noResultFound(): ISuccess<false> {
    return util.ok(false);
}
```
- Indicates handler found no match
- Allows chain to continue to next handler

**stopFindingResults()**:
```typescript
function stopFindingResults(): ISuccess<'stop'> {
    return util.ok('stop');
}
```
- Signals parser to stop processing
- Used for early termination conditions

### Step Parse Builder

**buildStepParse()**:
```typescript
function buildStepParse<TParse, TResult>(
    step: IParseStepForward<TParse>, 
    resultType: (ISubParseGroupResult<TResult> | ISubParseResult<TResult> | IDiscardResult)
): StepParse<TParse, TResult>
```

**Purpose**: Combines location/input information with result type
**Implementation**: Merges object properties from both parameters

## Usage Patterns

### Basic Handler Pattern

```typescript
function handlerFunction(input: string, current: ILocation): StringStepParseResult<TokenType> {
    if (matchesPattern(input)) {
        const parsed = extractMatch(input);
        const token = createToken(parsed, current);
        
        return util.ok({
            type: 'parse result',
            subResult: token,
            rest: input.slice(parsed.length),
            location: current.increaseChar(parsed.length)
        });
    }
    
    return internals.noResultFound();
}
```

### Discard Pattern

```typescript
function discardWhitespace(input: string, current: ILocation): StringStepParseResult<Token> {
    if (isWhitespace(input)) {
        const whitespace = extractWhitespace(input);
        
        return util.ok({
            type: 'discard',
            rest: input.slice(whitespace.length),
            location: current.increaseChar(whitespace.length)
        });
    }
    
    return internals.noResultFound();
}
```

### Stop Pattern

```typescript
function stopOnEndMarker(input: string, current: ILocation): StringStepParseResult<Token> {
    if (isEndMarker(input)) {
        return internals.stopFindingResults();
    }
    
    return internals.noResultFound();
}
```

### Complex Nested Parser Pattern

```typescript
function parseNestedStructure(input: string, current: ILocation): StringStepParseResult<Token> {
    // Create sub-parser for nested content
    const nestedParser = internals.createStringParser(
        handler1,
        handler2,
        handler3
    );
    
    const nested = nestedParser.parse(extractNested(input), current);
    
    if (nested.success) {
        const [results, remainder] = nested.value;
        
        return util.ok({
            type: 'parse result',
            subResult: createComplexToken(results),
            rest: remainder.remaining,
            location: remainder.location
        });
    }
    
    return nested; // Propagate error
}
```

## Integration with Processing Pipeline

### Pipeline Usage

The internals system is used throughout the Doculisp pipeline:

1. **Document Parser**: Uses string parsing to extract text/lisp blocks
2. **Tokenizer**: Creates string parser with multiple token handlers
3. **AST Parser**: Processes token arrays into syntax trees
4. **Doculisp Parser**: Handles high-level Doculisp constructs

### Dependency Registration

```typescript
const registerable: IRegisterable = {
    builder: (util: IUtil) => { 
        // Create internals implementation
        return internals;
    },
    name: 'internals',
    singleton: true,
    dependencies: ['util']
};
```

### Consumer Pattern

```typescript
// Typical usage in other parsers
function buildParser(internals: IInternals, util: IUtil) {
    const parser = internals.createStringParser(
        handlerFunction1,
        handlerFunction2,
        handlerFunction3
    );
    
    return function parse(input) {
        const result = parser.parse(input, startLocation);
        // Process result...
    };
}
```

## Error Handling

### Error Propagation

- **Handler Errors**: Immediately returned to caller
- **Parse Errors**: Wrapped with location context
- **Result Chain**: Errors propagate through entire pipeline

### Location Context

```typescript
// Errors maintain precise location information
if (!parsed.success) {
    return util.fail(parsed.message, currentLocation);
}
```

### Error Recovery

The parser system supports error recovery through:
- **Handler Fallbacks**: Try multiple handlers for resilience
- **Partial Results**: Return partial parse results with unparsed remainder
- **Context Preservation**: Maintain location info for debugging

## Performance Considerations

### Optimization Strategies

1. **Handler Order**: Place most common patterns first
2. **Early Termination**: Use 'stop' signal to avoid unnecessary processing
3. **Pattern Efficiency**: Use efficient regex patterns in handlers
4. **Memory Management**: Parsers create minimal intermediate objects

### Location Tracking Overhead

- **Precise Tracking**: Every parse step updates location
- **Character Counting**: Line/column tracking adds computational cost
- **Trade-off**: Accuracy vs performance favors accuracy for error reporting

## Key Implementation Notes

1. **Generic Design**: Supports any input/output types through generics
2. **Immutable Operations**: Parsing doesn't modify input, creates new state
3. **Composable Architecture**: Handlers can be combined and reused
4. **Location Precision**: Every token/result knows its exact source position
5. **Error Context**: Failures include location information for debugging
6. **Handler Independence**: Each handler is isolated and testable
7. **Result Accumulation**: Supports collecting multiple results from single parse
8. **Early Termination**: Handlers can signal completion to stop processing

This parser internals system provides the foundational architecture that enables the entire Doculisp processing pipeline to work with consistent patterns, comprehensive error handling, and precise location tracking throughout the parsing process.