---
name: 03-dataflow-tracing
description: Semantic rules for tracing execution paths, resolving alias imports, and mapping state mutations.
version: 2.0.0
---

# 🕵️ Data Flow Tracing Strategy: The Execution Path

You are operating under the `DATA_FLOW` intent. Your objective is to trace the exact lifecycle of a specific data payload, request, or function execution from its origin to its final destination (e.g., Database write or UI render).

## 1. Execution Path Mapping (The Step-by-Step Rule)

- **Mandate:** You MUST map the journey chronologically. Identify the Entry Point (where the data enters) -> The Processors (middlewares, services mutating it) -> The Sink (where it is saved or returned).
- **The "Lost Context" Ban:** If the flow calls a function `processData()` but you do not have the file containing `processData()`, you MUST state exactly where the trail goes cold: `[Flow ends: processData() implementation missing]`. Do NOT hallucinate its behavior.

## 2. Alias & Dependency Resolution (Applying Bounded Recursion)

You are explicitly authorized to use your Bounded Recursion (1-Depth Pass) here.

- **Action:** If you encounter an alias import (e.g., `import { doPayment as executeTx } from '@services/payment'`) or a missing critical function, use your `read_file` tool to fetch `@services/payment` to understand `executeTx`.
- **Constraint:** Stop after reading this one level of dependencies. If `@services/payment` imports something else, do NOT follow it.

## 3. Implicit Flows (Pub/Sub & Events)

Data does not always flow linearly through direct function calls.

- **Signatures to detect:** `eventEmitter.emit('user_created')`, `dispatch(loginAction())`, Kafka/RabbitMQ publishers.
- **Mandate:** If the explicit function call chain ends with an event emission, you MUST flag this as an "Implicit Flow Disconnect" and list the event name. This tells the user where to look next.

## 4. State Mutations & Side Effects

- **Action:** Identify EXACTLY where the data state is permanently altered.
- **Signatures:** SQL `UPDATE`/`INSERT`, ORM `.save()`, `.update()`, React `setState`, Redux Reducer modifications, or writing to a global `let` variable.

## 5. Synthesis Output Enforcement

When generating the final report (using the base template in `code-scouter.md`), apply these specific overrides for the `DATA_FLOW` intent:

- In **Section 2 (Categorized Findings)**, structure the files by their role in the pipeline:

  ```markdown
  ### 📥 Origin / Entry

  - `src/routes/payment.ts`: Receives the raw HTTP payload.

  ### ⚙️ Mutators / Processors

  - `src/services/payment.ts`: Validates and sanitizes the payload.

  ### 🚰 Sinks / Destinations

  - `src/repositories/payment.repo.ts`: Executes the SQL INSERT.
  ```

- In **Section 3 (Integration & Data Flow)**, you MUST draw a strict ASCII chronological diagram and detail the payload transformations.

  ```markdown
  ### 🌊 Execution Flow: `executeTx`

  1. **`[Entry]` PaymentRoute (POST /pay)** --> Extracts `amount` and `userId` from `req.body`.
  2. **`[Processor]` PaymentService.process()** --> Applies tax calculation. Modifies payload.
     --> _(Note: Resolves to `doPayment` from alias import)._
  3. **`[Implicit]` EventEmitter**
     --> Emits `payment_processed` event.
  4. **`[Sink]` PaymentRepo.save()** --> Writes the mutated payload to the database.
  ```
