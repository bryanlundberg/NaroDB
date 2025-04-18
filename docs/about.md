# About

## What is NaroDB?

On initialization, it creates a virtual clone of the dataset entirely in memory. All read and write operations are
performed directly in memory, enabling ultra-fast access and low-latency performance. At the end of the process
lifecycle—or at configurable intervals—the data is persisted to disk.

This approach offers high performance for scenarios where fast access to local data is critical, without the complexity
of a full-scale database.

## Philosophy

NaroDB is built on a few core principles:

- Fast by default: Operates entirely in memory and leverages efficient serialization for fast reads and writes.
- Minimalist: No schema definitions, no boilerplate. Just clean, predictable methods for data access.
- Low overhead: Small footprint, zero external dependencies, and fast startup time.
- Familiarity: Designed to feel intuitive for developers with experience in databases, offering common patterns.
