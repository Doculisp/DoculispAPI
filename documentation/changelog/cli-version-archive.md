<!-- (dl (section-meta CLI Version History \(Pre-API Extraction\))) -->

This archive contains the version history from when this functionality was part of the Doculisp CLI project. These versions (2.9.0 through 3.4.12) represent the evolution of the parsing and API functionality before it was extracted into this dedicated API library.

The current Doculisp API project begins with version 1.0.0, which represents the extraction of this functionality from the CLI into an independent library.

<!-- (dl (# Historical Context)) -->

The Doculisp CLI project contained both:
- Command-line interface functionality
- Core parsing and document processing functionality (now this API)

In October 2025, the core functionality was extracted into this dedicated API library to:
- Enable programmatic use of Doculisp functionality
- Support library integration in other projects  
- Provide a focused API without CLI dependencies
- Allow independent versioning of API vs CLI features

<!-- (dl (# CLI Version References)) -->

For reference, the CLI versions that contributed to this API functionality include:

- **3.4.12** (2025-09-23): TypeScript API Export improvements
- **3.4.10** (2025-09-20): Error handling and parsing improvements  
- **3.4.9** (2025-09-16): Documentation and API enhancements
- **3.4.8** (2025-09-13): Parser stability and performance improvements
- **3.4.7** (2025-09-10): String writer and output formatting improvements
- **3.4.6** (2025-09-06): Include builder and file resolution enhancements
- **3.4.5** (2025-09-03): AST parser and semantic validation improvements
- **3.4.4** (2025-08-30): Token parser and syntax handling improvements
- **3.4.3** (2025-08-27): Document parser and file handling improvements
- **3.4.2** (2025-08-24): Core parsing pipeline enhancements
- **3.4.0** (2025-08-20): Major parsing architecture improvements
- **3.3.0** (2025-08-15): Container system and dependency injection
- **3.2.0** (2025-08-10): Project file support and batch processing
- **3.1.0** (2025-08-05): Advanced parsing features and error handling
- **3.0.0** (2025-08-01): Complete rewrite of parsing system
- **2.9.1** (2025-07-25): Bug fixes and stability improvements
- **2.9.0** (2025-07-20): Initial TypeScript migration and API foundation

The detailed history of these versions remains available in the original Doculisp CLI project repository.