---
name: scout-pipeline
description: Standard Operating Procedure for the 4-Tier codebase scouting and data flow synthesis.
version: 2.0.0
---

# 🔄 Workflow: Multi-Tier Scout Pipeline

You are executing the Code Scout Pipeline. You MUST process the scouting request through the following phases in exact sequential order. Do NOT skip any phases.

## Phase 1: Wait for Deterministic Delegation (Tier 2 & 3)

1. **Mandate:** You must NOT use tools to search for files manually.
2. **Action:** Read the `stdout` (Standard Output) provided by the `scout-heuristic-scorer.js` script from the command initiation.
3. **Extraction:** Identify the exact Intent (`OVERVIEW`, `MODULE_DEEPDIVE`, or `DATA_FLOW`) and the list of Top N Absolute File Paths returned by the script.

## Phase 2: Parallel Context Ingestion (Tier 4 - Initial Read)

1. **Action:** Use your parallel file-reading capabilities to ingest the exact contents of the Top N files provided by the OS script.
2. **Constraint:** If the script returned zero files, output a failure message and abort the pipeline. Do not attempt to guess where the files are.

## Phase 3: The Bounded Recursion Pass (Tier 4 - Gap Filling)

1. **Analysis:** Review the logic within the ingested files. Look for broken links in the data flow, specifically:
   - Undefined core functions imported from external files.
   - Alias imports (e.g., `import { x as y } from '@utils/helper'`) where the source logic is missing but critical to understanding the flow.
2. **Action (Conditional):** If critical gaps exist, you are permitted to use your `read_file` tool to fetch a MAXIMUM of 3 additional files to fill these gaps.
3. **The 1-Depth Ban:** Once you read these additional files, you MUST stop. You are strictly forbidden from recursing further, even if those new files import other things.

## Phase 4: Skill Activation & Rule Loading

1. **Action:** Load the master skill file `skills/code-scout.md`.
2. **Conditional Loading:** Based on the Intent identified in Phase 1, load the specific sub-document required to analyze the context:
   - If `OVERVIEW`: Load `01-overview-strategy.md`
   - If `MODULE_DEEPDIVE`: Load `02-module-deepdive.md`
   - If `DATA_FLOW`: Load `03-dataflow-tracing.md`

## Phase 5: Synthesis and Persistence

1. **Action:** Synthesize the ingested code into a cohesive architectural map or data flow diagram.
2. **Formatting:** Format your output EXACTLY as defined in the `agents/code-scouter.md` template.
3. **Persistence:** Save the exact output to `.gemini-kit/tmp/scout/scout-[timestamp]-[slugified-args].md`.
   - If the folder `.gemini-kit/tmp/scout` does not exist, create it using the `shell` tool.
4. **Final Output:** Print the synthesized report to the terminal for the user.
