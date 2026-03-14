---
name: 01-overview-strategy
description: Semantic rules for synthesizing a high-level project overview based on configuration files and directory structures.
version: 2.0.0
---

# 🔭 Overview Strategy: The 10,000-Foot View

You are operating under the `OVERVIEW` intent. Your sole objective is to provide a macroscopic map of the repository. You must synthesize the raw output (dependencies and directory tree) provided by the OS-level script into a structured architectural summary.

## 1. Tech Stack Extraction & Categorization

You will receive a raw list of dependencies (e.g., from `package.json`, `go.mod`, or `requirements.txt`). You MUST categorize them intelligently. Do NOT just output a flat list.

- **Mandate:** Group the detected technologies into the following rigid categories. If a category has no matching dependencies, omit it entirely.
  - **Frontend/UI:** (e.g., React, Vue, Tailwind, Framer Motion)
  - **Backend/API:** (e.g., Express, NestJS, Gin, FastAPI, GraphQL)
  - **Data/State Layer:** (e.g., Prisma, Mongoose, Redux, Zustand, Postgres drivers)
  - **DevOps/Tooling:** (e.g., Docker, Webpack, Vite, Jest, ESLint)
- **The Hallucination Ban:** You are STRICTLY FORBIDDEN from listing a technology that is not explicitly present in the provided dependency list or config files. Do not guess the database if no DB driver is listed.

## 2. Structural Anatomy (Directory Mapping)

You will receive an ASCII directory tree (usually 3 levels deep). Your job is to assign semantic meaning to these folders.

- **Action:** Translate the raw folder names into architectural roles.
- **Example Mapping Constraint:**
  - If you see `src/controllers` and `src/routes`, label this area as the "API Routing & Request Handling Layer".
  - If you see `src/components` and `src/hooks`, label this as the "Reusable UI & Client Logic".
  - If you see `infrastructure/` or `k8s/`, label it as "Deployment & Orchestration".
- **The "Ignored Noise" Rule:** Do not explain standard boilerplate folders like `node_modules`, `dist`, `.git`, or `.vscode`. Focus ONLY on the domain-specific architecture.

## 3. Entry Point Identification

- **Action:** Based on the root files and tree, identify the likely execution entry points.
- **Signatures to look for:** `src/index.ts`, `src/main.ts`, `App.tsx`, `docker-compose.yml`, `Makefile`.
- **Formatting:** Highlight these specific files as the "Starting points for deeper investigation."

## 4. Synthesis Output Enforcement

When generating the final report (using the template in `code-scouter.md`), apply these specific rules for the `OVERVIEW` intent:

- In **Section 2 (Categorized Findings)**, output the folder architecture instead of specific file logic.

  ```markdown
  ### 📂 Architectural Boundaries

  - `src/modules/`: Contains domain-driven feature slices.
  - `src/shared/`: Global utilities and cross-cutting concerns.
  ```

- In **Section 3 (Integration & Data Flow)**, since you are doing an overview, output the macro-architecture flow instead of micro-data flow.

  ```markdown
  ### 🔄 Macro Flow

  - `[Client/UI]` --(REST/GraphQL)--> `[API Gateway/Routes]` --(calls)--> `[Services/Domain]` --(queries)--> `[Database]`
  ```
