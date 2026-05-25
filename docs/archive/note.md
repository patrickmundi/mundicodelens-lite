NEXT SESSION:

- Centralize remaining command orchestration
- Improve HTML/Django parser support
- Add telemetry/logging layer
- Begin multi-file context awareness

# MundiCodeLens Lite — Stabilization Notes

## Current Stabilization State

The extension architecture has significantly evolved from a simple MVP into a structured AI-assisted engineering tool.

Current working systems:

- Extension Development Host (EDH) stable
- Workspace loading stable
- OpenAI integration working
- AI webview rendering working
- Shared AI command orchestration working
- Context-aware prompt injection working
- Domain map loading working
- Multi-language parser significantly improved
- CodeLens restored and stabilized
- Shared command pipeline centralized into runAICommand.ts

---

# Current AI Features

The following actions are functional:

- Explain Code
- Full Explanation
- Refactor
- Fix Bug
- Optimize

These now share a centralized orchestration pipeline.

---

# Parser Improvements

Parser now supports improved detection for:

- JavaScript
- TypeScript
- Python
- HTML
- CSS

CSS extraction accuracy was significantly improved to correctly isolate selector blocks instead of unrelated structures.

---

# Current Architectural Direction

The extension is evolving toward:

UI Layer
→ Command Layer
→ Shared AI Pipeline
→ Parser Engine
→ Context Engine
→ OpenAI Adapter
→ Webview Renderer

The long-term goal is contextual AI-assisted software engineering rather than a simple code explainer.

---

# Important Current Files

Core orchestration:

- src/core/runAICommand.ts

Parser:

- src/utils/parser.ts

CodeLens logic:

- src/providers/CodeLensProvider.ts

Project context:

- src/context/

OpenAI integration:

- src/ai/openai.ts

---

# Current UX Direction

CodeLens buttons now appear primarily on meaningful structures instead of everywhere.

Goal:

- cleaner UX
- less visual noise
- context-aware inline actions

Future direction may include:

- hover-triggered actions
- contextual AI menus
- smarter structure targeting

---

# Remaining Known Issues

- CodeLens targeting still needs refinement
- Django template parsing needs improvement
- React/TSX parsing still basic
- Multi-file context awareness not implemented yet
- Related-file dependency reasoning not implemented yet

---

# Next High-Priority Targets

1. Refine CodeLens targeting precision
2. Improve React and Django parsing
3. Add multi-file context awareness
4. Add related-file dependency resolution
5. Add telemetry/logging layer
6. Improve prompt orchestration efficiency
7. Reduce unnecessary AI token usage

---

# Important Strategic Direction

The project is moving toward:

- semantic code understanding
- architecture-aware AI reasoning
- contextual engineering workflows
- intelligent refactoring support
- project-aware AI assistance

This is no longer intended to be only a “ChatGPT inside VSCode” extension.
