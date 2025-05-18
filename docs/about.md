# About

## What is NaroDB?

A database designed to feel natural and familiar, just like **JavaScript**.

## Design for Humans

Our goal is to provide an ergonomic, intuitive, and productive database that is easy for beginners to use. It avoids
unnecessary complexity and prioritizes simplicity so you can focus on building.

## Use Cases

NaroDB excels in scenarios such as:

- **Prototyping Applications**: Quick start with zero configuration
- **Real-time Applications**: Where data is frequently accessed and modified
- **Portable Applications**: Data can be stored locally and synced later

## How does it work?

Upon initialization, NaroDB loads data from disk into memory creating an initial tree clone. All read and write
operations are executed directly within this memory clone. Data is automatically saved to disk when the process exits,
this optimizes performance by reducing the need for constant disk I/O during normal operations.

## Technical Details

NaroDB is implemented in TypeScript and can be used in any Javascript Runtime.
