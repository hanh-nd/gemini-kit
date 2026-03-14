# 💡 Brainstorm Session: Native Skill Alignment

## 1. Problem Understanding

- **Core Problem:** The current implementation manually lists and injects skills using custom tools (`kit_get_skill_list`). This ignores Gemini CLI's built-in `activate_skill` mechanism, creating a "Parallel System" that is redundant, non-standard, and less efficient at scale.
- **Identified Constraints:** 
    - **Platform Standard:** We must align with the environment's native behaviors to benefit from future updates.
    - **Scalability:** The list of descriptions must be handled by the platform, not our extension's internal logic.
    - **User Consent:** Native activation includes built-in confirmation dialogs which are safer for the user.
- **Assumptions:** 
    - The environment provides `activate_skill` as a core tool.
    - The environment automatically scans the `skills/` directory of linked extensions.

## 2. Proposed Approaches

### Approach D: Custom Semantic Routing (Rejected)
- **Mechanism:** Extension-level vector search or two-pass LLM.
- **Reason for Rejection:** "Inventing another wheel." It adds complexity that the platform already handles natively.

### Approach F: Native Platform Integration (The "Perfect" Solution)

- **Mechanism:** 
    1. **Surgical Removal:** Delete the custom `kit_get_skill_list` and manual prompt injection logic.
    2. **Standardized Metadata:** Ensure all `SKILL.md` files have high-quality, concise YAML `description` fields.
    3. **Trust the Agent:** Rely on the LLM's native ability to see the skill list (auto-injected by Gemini CLI) and call the built-in `activate_skill` tool when intent matches.
- **Pros/Cons:** 
    - ✅ **Pros:** 100% standard; zero extension overhead; leverages platform security (consent); handles multilingual intent naturally via LLM reasoning.
    - ❌ **Cons:** We lose "silent activation" control (user must approve, which is actually a security plus).
- **Effort/Risk:** Lowest Effort / Lowest Risk.

## 3. Trade-off Matrix

| Criteria | Approach D (Custom) | Approach F (Native) |
|----------|-------------------|----------------------|
| **Scalability** | ⭐⭐ | ⭐⭐⭐ (Platform optimized) |
| **Maintainability** | ⭐ | ⭐⭐⭐ (Zero code) |
| **User Experience** | ⭐⭐ | ⭐⭐⭐ (Consistent UI) |
| **Standardization** | ❌ | ⭐⭐⭐ |

## 4. YAGNI Verdict

> **Verdict: Simplify (Total Migration to Native Activation)**

- **Analysis:** Our current internal routing logic is a relic from an era where we didn't fully trust or understand the platform's native capabilities. The "Scaling" and "Multilingual" problems are effectively solved by the LLM evaluating the small metadata list provided by the CLI. We should delete our custom implementation immediately.

## 5. Recommendation & Next Steps

- **Recommended:** **Approach F (Native Skill Integration)**.
- **Reasoning:** It turns our extension into a "Citizen of the Platform." By using `activate_skill`, we ensure that our skills work exactly like any other skill in the user's workspace, reducing cognitive load for both the user and the developer.
- **Next Steps:**
    1. **Audit:** Verify that all folders in `skills/` are recognized by `gemini skills list`.
    2. **Cleanup:** Remove `kit_get_skill_list` from `src/tools/core.ts`.
    3. **Instruction Update:** Update `agents/*.md` to remove mentions of "Extension Skill Discovery" and instead instruct agents to "Use the standard `activate_skill` tool if specialized instructions are needed."
    4. **Description Optimization:** Refine the `description` in every `SKILL.md` to be "Trigger Optimized" (e.g., "Use this skill for security audits and secret detection").

- **Handoff:** Ready to align with the platform? Run `/plan @tmp/brainstorms/brainstorm-native-skill-alignment.md`
