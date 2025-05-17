# About

## What is NaroDB?

NaroDB is a lightweight, document-oriented NoSQL database designed for fast data access and manipulation. It provides an in-memory data store particularly suitable for applications that require quick read and write operations without the overhead of a traditional database system.

## How does it work?

Upon initialization, NaroDB loads data from disk into memory creating an initial tree clone. All read and write operations are executed directly within this memory clone. Data is automatically saved to disk when the process exits, this optimizes performance by reducing the need for constant disk I/O during normal operations.

This architecture allows NaroDB to function fast as possible, adapting to various application needs.

## Core Principles

- **Performance First**: In-memory operations with efficient binary serialization for optimal speed
- **Developer Experience**: Clean, intuitive API with predictable behavior and comprehensive documentation
- **Flexibility**: Schema-free document model that adapts to your data, not the other way around
- **Simplicity**: Minimal setup and configuration, with sensible defaults
- **Familiarity**: Designed to feel natural for developers with experience in modern databases

## Use Cases

NaroDB excels in scenarios such as:

- **Prototyping and Development**: Quick setup with minimal configuration
- **Real-time Applications**: Where data is frequently accessed and modified


## Technical Details

NaroDB is implemented in TypeScript and can be used in any Javascript Runtime.
