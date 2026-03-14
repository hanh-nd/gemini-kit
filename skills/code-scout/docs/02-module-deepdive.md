---
name: 02-module-deepdive
description: Semantic rules for isolating and analyzing a specific feature module or domain boundary.
version: 2.0.0
---

# 🕵️ Module Deep-Dive Strategy: Domain Isolation

You are operating under the `MODULE_DEEPDIVE` intent. Your objective is to deconstruct a specific feature slice or domain module (e.g., "Payment", "Auth", "Shopping Cart"). You must map its internal anatomy and define its boundaries without bleeding into the rest of the application.

## 1. Boundary & Isolation Constraints

- **The "High Wall" Rule:** Focus strictly on the files provided that belong to the target module. Do NOT hallucinate interactions with other modules unless an explicit `import` or exported interface binds them.
- **Action:** Identify what this module exposes to the rest of the system (its Public API) versus what it keeps hidden (Internal Utility/State).

## 2. Anatomy of a Module

You must extract and categorize the module's internals into three distinct layers:

### A. The Data Shape (Models & Schemas)

- Look for TypeScript `interface`, `type`, Zod/Joi schemas, or ORM models (Prisma, TypeORM) related strictly to this module.
- **Mandate:** Briefly describe the core entities this module manages (e.g., "Manages `Transaction` and `Invoice` entities").

### B. The Entry Points (Controllers & Resolvers)

- Look for HTTP routes, GraphQL resolvers, or exported top-level UI components that serve as the "front door" to this module.
- **Mandate:** List how external clients or other modules trigger logic here.

### C. The Core Engine (Services & Business Logic)

- Look for classes, functions, or hooks containing the actual business rules (e.g., `calculateTaxes`, `verifyPaymentStatus`).
- **Mandate:** Separate these pure logic files from simple data-fetching or routing boilerplate.

## 3. Synthesis Output Enforcement

When generating the final report (using the base template in `code-scouter.md`), apply these specific overrides for the `MODULE_DEEPDIVE` intent:

- In **Section 2 (Categorized Findings)**, structure the files by the anatomy defined above.

  ```markdown
  ### 🧱 Module Public API (Exported/Routes)

  - `src/payment/payment.controller.ts`: Exposes `POST /pay` and `GET /status`.

  ### ⚙️ Internal Business Rules (Services)

  - `src/payment/tax.service.ts`: Calculates VAT before processing.

  ### 💾 Domain Models

  - `src/payment/payment.schema.ts`: Defines Zod validation for payment payloads.
  ```

- In **Section 3 (Integration & Data Flow)**, map how data moves _within_ this module, and specifically note what it needs from the outside world.

  ```markdown
  ### 🔄 Internal Module Flow

  - `[Request]` -> `PaymentController` -> `TaxService` -> `PaymentRepository`

  ### 🔌 External Dependencies

  - Relies on `UserModule` (via `import { getUser }`) to verify user status before payment.
  ```
