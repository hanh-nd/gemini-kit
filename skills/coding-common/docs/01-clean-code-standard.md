---
name: clean-code-standard
description: Technical directives for naming conventions, logic density, and architectural patterns for new code.
version: 1.1.0
---

# 🧹 Clean Code & Convention Standard

## 1. Naming Conventions (Strict Enforcement)

You MUST identify and mirror the project's existing case style. If no clear pattern exists, default to the following:

- **Variables & Functions:** `camelCase` (e.g., `isAuthorized`, `fetchUserData`).
- **Classes & Components:** `PascalCase` (e.g., `AuthService`, `UserDashboard`).
- **Constants & Enums:** `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_LIMIT`).
- **Boolean Prefixes:** Use `is`, `has`, `should`, or `can` to define state.

## 2. Logic Density & Responsibility

- **Single Responsibility (SRP):** Each function must do exactly one thing. If a function handles both data fetching and UI formatting, it MUST be split.
- **Function Length:** Functions should not exceed 20 lines of active logic.
- **No Magic Strings:** All recurring strings or numbers must be extracted into a `constants` file or a local `const` block.
- **Documentation:** Exported entity should have a concise JSDoc block. Do not explain _how_ the code works; explain _why_ or any specific edge cases.

## 3. Pattern Mirroring (Zero-Inference)

Before writing the first line of code, use `read_file` or `grep` to analyze 1-2 existing files in the target directory to determine:

- **Indentation:** Tab vs. Space (and count).
- **Import Style:** Named imports vs. Default imports.
- **Semicolons:** Required vs. Omitted.

## 4. Implementation Example

```javascript
/**
 * Persists active records that exceed the defined threshold.
 * @param {Object} record - The data object to validate and save.
 */
function saveHighValueActiveRecord(record) {
  const isEligible = record.status === STATUS.ACTIVE && record.value > VALUE_THRESHOLD;

  if (isEligible) {
    database.persist(record);
  }
}
```
