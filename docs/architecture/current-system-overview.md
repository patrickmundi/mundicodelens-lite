# MundiCodeLens-Lite — Current System Overview

## Project Purpose

MundiCodeLens-Lite is an AI-assisted VS Code extension designed to help developers:

- Explain code
- Refactor code
- Optimize code
- Detect/fix bugs
- Render AI explanations in a dedicated webview panel

The project serves as an AI engineering assistant platform and foundational tooling layer for future MundiSaaS ecosystem development.

---

# Current Architecture

## Core Layers

### 1. Command Layer

Handles user-triggered VS Code commands.

Current commands:

- Explain Code
- Full Explanation
- Refactor
- Fix Bug
- Optimize

Location:

```text
src/commands/
```
