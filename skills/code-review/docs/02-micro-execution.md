---
name: 02-micro-execution
description: Strict constraints for tracing data flow, state mutations, and enforcing actionable feedback.
version: 1.0.0
---

# 🔬 Micro Execution: Data Tracing & Actionability Constraints

During this phase, you are analyzing the logic execution. You must discard top-to-bottom reading and adopt a data-centric tracing model.

## 1. Execution Tracing (The "Data Flow" Mandate)

- **Mandate:** You MUST trace the execution path of the code. Follow the data from Input (Arguments/Requests) -> Mutation/Validation -> Output (Returns/Responses).
- **The Boundary Validation Rule:** Flag any external input (from APIs, DBs, or user params) that is used in logic _before_ being structurally validated (e.g., missing Zod/Joi parsing or type guarding).
- **The Branching Exhaustion Ban:** Flag functions that do not explicitly handle all logical branches. If an `if` condition returns early, verify that the default/fallback execution path still maintains type safety and logic integrity.

## 2. The Actionability Mandate (CRITICAL)

You are FORBIDDEN from leaving vague, theoretical, or purely philosophical feedback.

- **The "No Complaint Without Solution" Ban:** If you state that a piece of code is "inefficient", "complex", or "unclean", but you CANNOT generate a specific code snippet to fix it, you MUST delete that feedback entirely.
- **Example Constraint:** Instead of saying: _"Avoid mutating the array directly, use array methods."_
  You MUST provide the exact fix:
  ```typescript
  // Suggestion: Use .map() to avoid mutating the original array
  const updatedUsers = users.map((user) =>
    user.id === targetId ? { ...user, active: true } : user
  );
  ```

## 3. State Mutation & Side Effects

- **Mandate:** Identify variables declared with `let` or `var`, and objects/arrays that are modified in-place.
- **The "Hidden Side-Effect" Ban:** Flag functions that claim to simply compute or fetch data (e.g., `calculateTotal`, `getUser`) but silently mutate an external state, write to a database, or alter global variables. Functions must either be pure OR explicitly named for their side effects (e.g., `updateUserAndCalculate`).

## 4. Error Handling Constraints

- **The "Swallowed Error" Ban:** Flag any `catch (e)` or `.catch()` block that ignores the error (e.g., empty blocks, or just `console.log(e)` without throwing or returning a valid error response).
- **Mandate:** Require explicit error throwing with context, or proper forwarding to the next error-handling middleware.
  ```typescript
  // Flag this as a [BLOCKER] for swallowed errors:
  try {
    await processPayment();
  } catch (error) {
    logger.error(error); // Fails to halt the execution flow
  }
  ```
