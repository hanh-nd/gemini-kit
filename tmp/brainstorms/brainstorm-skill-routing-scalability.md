# 💡 Brainstorm Session: Skill Routing Scalability vs Native Activation

## 1. Problem Understanding

- **Core Problem:** The current skill routing implementation lists all available skills (names + descriptions) in the agent's context via MCP. As the number of skills grows, this leads to significant token expansion and potential "intent collision" (conflicts) where the LLM becomes confused by overlapping descriptions.
- **Identified Constraints:**
  - **Token Budget:** High-volume context reduces speed and increases API costs.
  - **Intent Accuracy:** Overlapping descriptions in a large list decrease the probability of correct skill selection.
  - **Maintainability:** Manually managing a growing list of descriptions in every prompt is error-prone.
- **Assumptions:**
  - Gemini CLI "Native Tool calling" refers to an on-demand loading mechanism (like trigger-based `activate_skill`) that only injects instructions when a high-confidence match is found.

## 2. Proposed Approaches

### Approach A: Manual Full-List Routing (Current)

- **Mechanism:** The system calls `kit_get_skill_list` and injects the entire metadata block into the system prompt. The agent then performs a "Zero-Shot" evaluation to pick a skill.
- **Pros/Cons:**
  - ✅ **Pros:** Absolute agent awareness; can combine multiple skills in one go without pre-analysis.
  - ❌ **Cons:** Token usage is $O(N)$ where $N$ is the number of skills; High risk of "Description Dilution" (LLM loses focus).
- **Effort/Risk:** Low Effort / High Scalability Risk.

### Approach B: Native Rule-Based Activation (Gemini CLI Standard)

- **Mechanism:** Skills define explicit triggers (keywords, file patterns, or command names). The orchestrator matches the prompt against these rules _before_ invoking the agent, loading only relevant `<activated_skill>` blocks.
- **Pros/Cons:**
  - ✅ **Pros:** Near-zero token overhead for unused skills; precise instruction injection; avoids conflicts between unrelated skills (e.g., Security vs UI).
  - ❌ **Cons:** "Stiff" triggers might miss subtle intents that an LLM would catch.
- **Effort/Risk:** Medium Effort (Requires trigger definitions) / Low Risk.

### Approach C: Hybrid Semantic Indexing

- **Mechanism:** Store skill descriptions in a local vector index. Perform a semantic search on the user prompt to find the top 2-3 most relevant skills and only present _those_ to the agent for final activation.
- **Pros/Cons:**
  - ✅ **Pros:** Best of both worlds—scales to hundreds of skills while maintaining LLM-level reasoning for activation.
  - ❌ **Cons:** Adds complexity (indexing step); requires a search tool.
- **Effort/Risk:** High Effort / Minimal Scalability Risk.

## 3. Trade-off Matrix

| Criteria                  | Approach A (Manual) | Approach B (Native) | Approach C (Hybrid) |
| ------------------------- | ------------------- | ------------------- | ------------------- |
| **Token Efficiency**      | ⭐                  | ⭐⭐⭐              | ⭐⭐                |
| **Accuracy (Large List)** | ⭐                  | ⭐⭐                | ⭐⭐⭐              |
| **Setup Speed**           | ⭐⭐⭐              | ⭐⭐                | ⭐                  |
| **Flexibility**           | ⭐⭐⭐              | ⭐                  | ⭐⭐                |

## 4. YAGNI Verdict

> **Verdict: Simplify (Migrate to Native Activation)**

- **Analysis:** Approach A is a prototype pattern. At 7 skills, it works. At 50+ skills, the LLM will hallucinate activations or hit context limits. Approach C is over-engineered for the current project phase. Approach B (Native Activation) is the most robust and scalable path forward.

## 5. Recommendation & Next Steps

- **Recommended:** **Approach B (Native Activation)**.
- **Reasoning:** It aligns with the "Requirement Alignment" principle—only load what is strictly necessary. By moving description evaluation out of the main agent loop and into a pre-processing rule-match (or specific activation command), we preserve the agent's context window for the actual task logic.
- **Next Steps:**
  1. Update `SKILL.md` template to include a mandatory `activation_rules` section.
  2. Refactor `orchestrator.ts` to scan for these rules before generating the final prompt.
  3. Replace the full-list injection in `commands/*.toml` with a "On-demand Activation" instruction.

- **Handoff:** Ready to plan the migration? Run `/plan @tmp/brainstorms/brainstorm-skill-routing-scalability.md`
