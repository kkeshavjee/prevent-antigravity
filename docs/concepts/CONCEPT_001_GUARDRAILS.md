# Concept Note: AI Guardrails & Safety Architecture

The PREVENT dawn application interacts with patients in a high-stakes clinical context (diabetes prevention). This architecture ensures that AI interactions are safe, auditable, and correctable.

## 1. "The Bouncer" (Confidence & Safety Guardrail)
**Goal:** Prevent harmful, hallucinated, or non-clinical advice.

- **Mechanism:** A lightweight, high-reliability validator (separate from the main agent) that intercepts all `Orchestrator` outputs.
- **Verification Logic:**
    - **Clinical Filtering:** Checks response against a static whitelist of "Approved Clinical Recommendations" (e.g., CDC/Health Canada guidelines).
    - **Confidence Score:** Uses a small, specialized LLM (e.g., Gemini Flash with a narrow prompt) to score the "harm potential" of the response.
    - **Fallback:** If a response is rejected, "The Bouncer" swaps it for a safe, human-curated fallback (e.g., "I'm not sure about that. Let me look it up or you can ask your doctor for specifics.").

## 2. "The Receipt" (Unalterable Audit Trail)
**Goal:** PHIPA/Legal accountability and system debugging.

- **Mechanism:** An append-only log stored in a secure database (not the local session state).
- **Data Extracted (per turn):**
    - Raw User Input + Patient Profile (Context).
    - Raw LLM Prompt (The "ask").
    - Raw LLM Output (The "raw result").
    - Bouncer Decision + Final Output (The "safe result").
    - `variant_id` (for RCT/Research tracking).

## 3. "The Fix Button" (User-Driven Model Correction)
**Goal:** Address "AI Hallucination" and build user trust.

- **Mechanism:** A UI element attached to every AI response that allows the user to say "That's not right."
- **Functionality:** 
    - **Context Update:** If the bot assumes a user loves running but they actually have knee pain, clicking "Fix" allows them to correct that specific biomarker or preference.
    - **Immediate Refresh:** The updated fact is pushed back into the `AgentState`, and the bot re-generates the response instantly with the new information.
