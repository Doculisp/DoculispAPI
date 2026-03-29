<!-- (dl (section-meta AST Node Types)) -->

These types represent the Abstract Syntax Tree (AST) nodes that form the structural representation of parsed Doculisp code.

<!-- (dl (##core-ast-type `CoreAst`)) -->

Union type representing all core AST node types:

```typescript
type CoreAst = IdentifierAst | IAstValue;
```

**Component Types:**
- **`IdentifierAst`** - AST nodes representing identifiers and commands
- **`IAstValue`** - AST nodes representing literal values

<!-- (dl (##root-ast-type `RootAst`)) -->

Root container for an entire AST with project location context:

```typescript
interface RootAst {
    readonly ast: CoreAst[];
    readonly location: IProjectLocation;
}
```

**Key Features:**
- **AST array** - Top-level AST nodes in document order
- **Project context** - Location information for error reporting and debugging
- **Immutable structure** - Read-only AST representation

<!-- (dl (##ast-value-type `IAstValue`)) -->

Represents literal values in the AST:

```typescript
interface IAstValue {
    readonly type: 'ast-value';
    readonly value: string;
    readonly location: ILocation;
}
```

**Properties:**
- **Type discriminator** - Identifies this as a value node
- **String value** - The literal text content
- **Location tracking** - Precise source location for error reporting

<!-- (dl (##ast-identifier-type `IAstIdentifier`)) -->

Represents identifier nodes (commands, block names):

```typescript
interface IAstIdentifier {
    readonly type: 'ast-identifier';
    readonly value: string;
    readonly location: ILocation;
    readonly blockRange: IRange;
}
```

**Properties:**
- **Type discriminator** - Identifies this as an identifier node
- **Value text** - The identifier string
- **Location tracking** - Source location for debugging
- **Block range** - Range information for the entire block

<!-- (dl (##ast-command-type `IAstCommand`)) -->

Represents command nodes with parameters:

```typescript
interface IAstCommand {
    readonly type: 'ast-command';
    readonly value: string;
    readonly location: ILocation;
    readonly parameter: IAstParameter;
    readonly blockRange: IRange;
}
```

**Properties:**
- **Type discriminator** - Identifies this as a command node
- **Command value** - The command name
- **Parameter** - Single parameter (IAstParameter) for this command
- **Location tracking** - Source position for error reporting
- **Block range** - Range information for the entire block

<!-- (dl (##ast-container-type `IAstContainer`)) -->

Represents container nodes that group other AST elements:

```typescript
interface IAstContainer {
    readonly type: 'ast-container';
    readonly value: string;
    readonly location: ILocation;
    readonly subStructure: IdentifierAst[];
    readonly blockRange: IRange;
}
```
Type discriminator** - Identifies this as a container node
- **Container value** - The container identifier
- **Sub-structure** - Array of IdentifierAst elements (nested identifiers, commands, containers)
- **Location context** - Position information for debugging
- **Block range** - Range information for the entire block
- **Hierarchical structure** - Enables nested Doculisp blocks
- **Location context** - Position information for debugging