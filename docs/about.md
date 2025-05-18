# About

## What is NaroDB?

NaroDB is a lightweight, document-oriented NoSQL database designed for fast data access and manipulation. It provides an
in-memory data store particularly suitable for applications that require quick read and write operations without the
overhead of a traditional database system.

## Core Principle

A database designed to feel natural and familiar, just like **JavaScript**.

### Design for Humans

Our goal is to provide an ergonomic, intuitive, and productive database that is easy for beginners to use. It avoids
unnecessary complexity and prioritizes simplicity so you can focus on building.

## Use Cases

NaroDB excels in scenarios such as:

- **Prototyping Applications**: Quick start with zero configuration
- **Real-time Applications**: Where data is frequently accessed and modified
- **Offline Applications**: Data can be stored locally and synced later

## How does it work?

Upon initialization, NaroDB loads data from disk into memory creating an initial tree clone. All read and write
operations are executed directly within this memory clone. Data is automatically saved to disk when the process exits,
this optimizes performance by reducing the need for constant disk I/O during normal operations.

This architecture allows NaroDB to function fast as possible, adapting to various application needs.

## Technical Details

NaroDB is implemented in TypeScript and can be used in any Javascript Runtime.
