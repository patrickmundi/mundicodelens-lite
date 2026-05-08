# Future Roadmap

## Planned Architecture Evolution

### ParserFactory Architecture

Future parser separation:

```text
src/parsers/
├── BaseParser.ts
├── JavaScriptParser.ts
├── PythonParser.ts
├── HtmlParser.ts
└── ParserFactory.ts
```

Goals:

- cleaner parser boundaries
- language-specific extraction logic
- easier debugging
- easier future expansion

---

## AST-Based Parsing

Planned migration toward:

- Babel AST
- TypeScript Compiler API
- Tree-sitter
- semantic parsing

Benefits:

- more accurate structure detection
- nested structure awareness
- safer extraction
- component-level understanding

---

## Prompt Specialization

Future AI prompt separation:

```text
src/ai/prompts/
├── explainPrompt.ts
├── optimizePrompt.ts
├── refactorPrompt.ts
└── fixPrompt.ts
```

Goals:

- better task-specific AI behavior
- more consistent responses
- cleaner orchestration
- improved maintainability

---

## Planned Rendering Improvements

Future rendering evolution:

- inline ghost rendering
- diff previews
- apply-refactor workflows
- preview-before-apply system
- safer modification pipeline

---

## Planned UX Improvements

Future UX direction:

- cleaner command grouping
- contextual CodeLens visibility
- inline quick actions
- semantic hover cards
- command prioritization

---

## Planned AI Capabilities

Future AI enhancements:

- multi-file awareness
- repository-level understanding
- semantic code navigation
- architecture-aware refactoring
- workflow orchestration
- project memory layer

---

## Planned Language Expansion

Future supported ecosystems:

- React / JSX
- TSX
- CSS / SCSS
- SQL
- Django templates
- Next.js structures
- Python frameworks

---

## Long-Term Vision

MundiCodeLens-Lite evolves into:

- AI engineering assistant
- intelligent developer tooling platform
- software architecture companion
- foundational AI productivity infrastructure for the MundiSaaS ecosystem

---

# Strategic Philosophy

Core architectural principles:

- source code remains clean
- rendering remains isolated
- commands remain modular
- parsing responsibilities remain separated
- AI orchestration remains controllable
- stabilization precedes feature expansion
