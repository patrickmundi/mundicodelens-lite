# Stabilization Notes

## Overview

This document records major stabilization decisions and architectural corrections made during the recovery/rebuild phase of MundiCodeLens-Lite.

Purpose:

- preserve architectural lessons
- prevent repeated mistakes
- document recovery rationale
- capture important engineering decisions

---

# Major Stabilization Achievements

## 1. Removed Recursive Source Contamination

### Previous Architecture

AI explanations were injected directly into source code as comments.

Flow:

```text
AI response
→ formatted as comments
→ inserted into editor
→ parser re-detected generated comments
→ recursive contamination
```
