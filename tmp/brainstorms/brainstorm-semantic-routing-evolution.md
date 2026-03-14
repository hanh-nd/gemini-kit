# 💡 Brainstorm Session: Semantic Routing Evolution

## 1. Problem Understanding

- **Core Problem:** Keyword-based triggers (Approach B) are rigid, language-dependent, and fail with low-quality prompts. We need a system that understands **Intent** rather than just **Strings** to scale globally.
- **Identified Constraints:** 
    - **Multilingual Support:** Must work regardless of whether the prompt is in English, Vietnamese, etc.
    - **Fuzzy Intent:** Must activate "Security" for "Make sure the login is safe" even without the keyword "JWT" or "Password".
    - **Token Efficiency:** Must avoid loading the full description list into the primary agent context.
- **Assumptions:** 
    - We have access to an embedding model or a cheap "Classifier" pass (Intent Detection).

## 2. Proposed Approaches (Refined)

### Approach B: Rigid Rules (Rejected for Production)
- **Mechanism:** Hardcoded keywords.
- **Why it fails:** Language locks (English only) and rigid matching. Requires "Perfect Prompting".

### Approach D: Two-Pass Semantic Routing (Production Grade)

- **Mechanism:** 
    1. **Pass 1 (The Gatekeeper):** Use a lightweight semantic match (Small LLM pass or Vector Search) to compare the User Prompt against a "Skill Map" (Embeddings of skill purposes).
    2. **Activation:** The Gatekeeper returns the Top-N relevant skill names.
    3. **Injection:** The Orchestrator injects only those specific skills into the primary agent's instructions.
- **Pros/Cons:** 
    - ✅ **Pros:** Language agnostic (Semantics are universal); Handles vague prompts; High token efficiency.
    - ❌ **Cons:** Requires a secondary API call or local embedding engine.
- **Effort/Risk:** High Effort / Lowest Risk.

### Approach E: Autonomous Agent-Driven Discovery

- **Mechanism:** 
    1. The agent starts with **Zero Skills** loaded.
    2. The system prompt contains a single instruction: "If you need specialized knowledge (e.g., Security, Testing), use the `kit_get_skill_list` tool first to find relevant rules."
    3. The agent calls the tool *only if* it identifies a need.
- **Pros/Cons:** 
    - ✅ **Pros:** 100% accurate to the agent's actual needs; zero pre-processing overhead.
    - ❌ **Cons:** Adds an extra turn (latency) to the conversation.
- **Effort/Risk:** Low Effort / Medium Risk (Latency).

## 3. Trade-off Matrix

| Criteria | Approach B (Rules) | Approach D (Semantic) | Approach E (Agent-Led) |
|----------|-------------------|----------------------|-----------------------|
| **Multilingual** | ❌ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Token Efficiency** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Accuracy** | ⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Latency** | ⭐⭐⭐ (Instant) | ⭐⭐ (Pre-pass) | ⭐ (Extra turn) |

## 4. YAGNI Verdict

> **Verdict: Proceed with Approach D (Semantic Routing)**

- **Analysis:** Approach B is a "Hard Step" that breaks the user experience for non-English users. Approach E is elegant but the latency cost of an extra turn is high. Approach D provides the best balance of scalability and "Intelligence" without burdening the primary agent with documentation.

## 5. Recommendation & Next Steps

- **Recommended:** **Approach D (Semantic Intent Mapping)**.
- **Reasoning:** By using semantic matching, we ensure that "kiểm tra bảo mật" triggers the Security skill just as effectively as "check security". This makes Gemini-Kit a global-ready tool.
- **Next Steps:**
    1. Create an `intent_vectors.json` that stores semantic representations of skill purposes.
    2. Implement a `kit_match_intent` tool that uses cosine similarity (or a small LLM call) to select skills.
    3. Update `orchestrator.ts` to perform this "Pass 1" before every agent handoff.

- **Handoff:** Ready to design the Semantic Gatekeeper? Run `/plan @tmp/brainstorms/brainstorm-semantic-routing-evolution.md`
