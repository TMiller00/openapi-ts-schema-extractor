# TypeScript Schema Type Generator

A CLI tool built with Deno that generates TypeScript type definitions from component schemas. It extracts types from a components interface and generates corresponding type definitions in a separate file.

## Features

- Extracts schema types from a TypeScript components interface
- Generates type definitions with proper imports
- Watch mode for automatic regeneration on file changes
- Type-safe error handling
- Zero external runtime dependencies

## Prerequisites

- [Deno](https://deno.land/) installed on your system

## Installation

```bash
# Clone the repository
git clone TMiller00/openapi-ts-schema-extractor
cd openapi-ts-schema-extractor
```

## Usage

Basic usage:
```bash
deno run dev -i ./input.ts -o ./types/generated.ts
```

Watch mode:
```bash
deno run dev -i ./input.ts -o ./types/generated.ts
```

Compile and run:
```bash
deno compile --allow-read --allow-write main.ts
./openapi-ts-schema-extractor --w -i ./input.ts -o ./types/generated.ts
```

### CLI Options

- `-i, --input <path>`: Input TypeScript file containing components interface (required)
- `-o, --output <path>`: Output file for generated types (required)
- `-w, --watch`: Enable watch mode to regenerate on file changes
- `-h, --help`: Show help information
- `-V, --version`: Show version information

## Example

Given an input file with a components interface:

```typescript
export interface components {
  schemas: {
    User: {
      id: string;
      name: string;
    };
    Post: {
      id: string;
      title: string;
      content: string;
    };
  };
}
```

The tool will generate:

```typescript
// This file is auto-generated. Do not edit directly.
import type { components } from '../input';

type Schema<T extends keyof components['schemas']> = components['schemas'][T];

export type User = Schema<'User'>;
export type Post = Schema<'Post'>;
```

## Project Structure

- `main.ts`: CLI entry point and program orchestration
- `reader.ts`: Handles file reading and TS-Morph setup
- `parser.ts`: Parses the TypeScript AST to extract schema types
- `writer.ts`: Generates and writes the output type definitions

## License

MIT
