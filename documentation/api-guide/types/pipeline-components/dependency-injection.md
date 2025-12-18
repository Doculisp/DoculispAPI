<!-- (dl (section-meta Dependency Injection)) -->

These interfaces provide dependency injection capabilities for testing, modularity, and component replacement throughout the API.

<!-- (dl (##icontainer-type `IContainer`)) -->

Main dependency injection container interface for component management:

```typescript
interface IContainer {
    buildAs<T>(key: string): T;
    buildTestable(): ITestableContainer;
}
```

**Core Capabilities:**
- **Component resolution** - Retrieve registered components by key
- **Type safety** - Generic `buildAs<T>` ensures correct return types  
- **Testable creation** - Generate isolated containers for testing
- **Dependency coordination** - Manage component lifecycles and dependencies

**Usage Pattern:**
```typescript
// Get components from container
const controller = container.buildAs<IController>('controller');
const parser = container.buildAs<IAstParser>('astParser');
const pathConstructor = container.buildAs<PathConstructor>('pathConstructor');
```

<!-- (dl (##itestable-container-type `ITestableContainer`)) -->

Extended container interface with test replacement capabilities:

```typescript
interface ITestableContainer extends IContainer {
    replaceValue<T>(fake: T, key: string): void;
}
```

**Testing Features:**
- **Component replacement** - Swap real implementations with test fakes
- **Isolation** - Independent container instances for each test
- **Fake injection** - Replace file system, parsers, or other dependencies
- **Test control** - Complete control over component behavior in tests

**Testing Pattern:**
```typescript
// Create testable container
const testContainer = container.buildTestable();

// Inject test fakes
const mockFileSystem = createMockFileSystem();
testContainer.replaceValue(mockFileSystem, 'fileHandler');

// Test with controlled dependencies
const api = new DoculispApi(testContainer);
```

<!-- (dl (##imanager-type `IManager`)) -->

Container management interface for component registration and lifecycle:

```typescript
interface IManager {
    register<T>(key: string, factory: () => T): void;
    registerSingleton<T>(key: string, factory: () => T): void;
    registerInstance<T>(key: string, instance: T): void;
}
```

**Registration Types:**
- **`register`** - New instance per request (transient)
- **`registerSingleton`** - Single shared instance (singleton)
- **`registerInstance`** - Pre-created instance registration
- **Factory functions** - Lazy instantiation with dependency resolution

<!-- (dl (##iregistry-type `IRegistry`)) -->

Registry interface for component lookup and resolution:

```typescript
interface IRegistry {
    resolve<T>(key: string): T;
    canResolve(key: string): boolean;
    getRegistrations(): string[];
}
```

**Registry Operations:**
- **Component resolution** - Look up registered components by key
- **Availability checking** - Verify if components are registered
- **Registration listing** - Get all available component keys
- **Dependency validation** - Ensure all required components are available

**Container Architecture Benefits:**
- **Modularity** - Clean separation between components
- **Testability** - Easy mocking and replacement for tests
- **Flexibility** - Swap implementations without changing client code
- **Maintainability** - Clear dependency declarations and management

**Example Setup:**
```typescript
// Component registration
manager.registerSingleton('fileHandler', () => new FileHandler());
manager.register('astParser', () => new AstParser());
manager.registerInstance('pathConstructor', createPathConstructor());

// Component usage
const fileHandler = registry.resolve<IFileHandler>('fileHandler');
const canParse = registry.canResolve('astParser');
```