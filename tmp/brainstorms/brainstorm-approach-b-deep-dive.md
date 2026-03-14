# 💡 Brainstorm Session: Deep Dive on Approach B (Native Activation)

## 1. Problem Understanding

- **Core Problem:** Transitioning from "Full Context" (listing all metadata) to "Just-in-Time Context" (loading only relevant skills).
- **Identified Constraints:** 
    - **Fast Discovery:** The pre-processing step must be near-instant (Regex or Keyword).
    - **Reliability:** The rules must be broad enough to catch intent but specific enough to avoid false positives.
- **Assumptions:** 
    - The Orchestrator can parse YAML/TOML metadata from `SKILL.md` files efficiently before triggering the agent.

## 2. Proposed Mechanism: "Trigger-Based Instruction Injection"

### The Activation Rule Structure
Every `SKILL.md` is updated to include an `activation` block in its frontmatter. This block defines the "Entry Points" for the skill.

**Example: `skills/security/SKILL.md` Update**
```markdown
---
name: security
description: Enforces secure coding practices and audits for secrets.
activation:
  keywords: ["auth", "password", "jwt", "crypto", "login", "secret", "token"]
  file_patterns: ["**/auth/**", "**/security/**", ".env*"]
  commands: ["/code", "/review", "/fix"]
---
```

### The Orchestrator Evaluation Logic
When a user types `/do Add JWT validation to the auth service`:
1. **Keyword Match:** Orchestrator finds "JWT" and "auth" in the prompt.
2. **Hit:** `security` skill is flagged.
3. **Injection:** The Orchestrator reads `skills/security/SKILL.md` and wraps it in `<activated_skill>` tags.
4. **Agent Delivery:** The Coder agent receives the task *plus* the Security instructions, but **zero** information about the `unit-test` or `backend-architect` skills.

## 3. Implementation Examples

### Update Example A: The Skill Metadata
```yaml
# Inside skills/unit-test/SKILL.md
activation:
  keywords: ["test", "coverage", "mock", "vitest", "assert", "fix tests"]
  file_patterns: ["**/*.test.ts", "**/__tests__/**"]
```

### Update Example B: The Command Prompt (do.toml)
**Before:**
`Call kit_get_skill_list to see what we can do.`

**After:**
`Check for active skills in <activated_skill> tags. If none are present and you suspect a skill is needed (e.g., Security), ask the user to activate it or use keywords to trigger auto-activation.`

## 4. Evaluation of Agent Activation

| Event | Current Agent Behavior (Approach A) | Approach B Behavior (Native) |
|-------|-----------------------------------|----------------------------|
| **Receiving Command** | Scans a list of 15+ skill descriptions. | Scans 0-2 already active skills. |
| **Cognitive Load** | High. Must decide *if* a skill is needed among many. | Low. Logic is pre-applied; agent just follows active rules. |
| **Conflictness** | High. "Security" and "Review" descriptions might overlap. | Low. Only the relevant rule-set is present. |
| **Token Expansion** | Expands by 200 tokens *per available skill*. | Expands only by the *size of the active skill*. |

## 5. YAGNI Verdict

> **Verdict: Proceed (Crucial for V4.0 Scale)**

- **Analysis:** We are currently at 7 skills. This is the "Inflection Point." Adding 5 more skills will make the system prompt 50% documentation and 50% actual task. Native activation is not over-engineering; it is a foundational performance fix.

## 6. Recommendation & Next Steps

- **Recommended:** **Hybrid Trigger Logic**. Use Regex for speed, but allow the Agent to "self-correct" by explicitly requesting a skill if the Orchestrator missed it (e.g., `[RE-ROUTE: activate_skill(name: "security")]`).
- **Next Steps:**
    1. **Surgical Update:** Add `activation` YAML to all 7 current skills.
    2. **Refactor `core.ts`:** Create a `kit_match_skills(prompt)` function.
    3. **Update `do.toml`:** Change the sequence to: `match_skills` -> `load_instructions` -> `invoke_agent`.

- **Handoff:** Ready to implement the Matcher? Run `/plan @tmp/brainstorms/brainstorm-approach-b-deep-dive.md`
