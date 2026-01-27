# Lessons Learned: Working with AI Coding Assistants

> Patterns and practices discovered while building the Antigravity project that improve AI-assisted development.

---

## 1. Session Continuity

**Problem**: AI assistants have no memory between sessions.

**Solution**: Maintain a single `docs/active_context.md` file that contains:
- One-line project description
- Key files map (so the AI doesn't hunt around)
- Current state (branch, what's done)
- Prioritized next actions

**Workflows**:
- `/save-context` — Update the file at end of session
- `/load-context` — AI reads the file at start of session

**Key insight**: Keep it in ONE file. Don't scatter context across multiple locations.

---

## 2. Consistent Behaviors via Workflows

**Problem**: AI does things differently each time.

**Solution**: Create workflow files in `.agent/workflows/` with explicit step-by-step instructions.

**Format**:
```markdown
---
description: Short description for the AI to match against
---

# Workflow Name

## Steps
1. Do X
2. Do Y
3. Confirm with user

## Notes
- Any constraints or exceptions
```

**Key insight**: If you want the AI to do something the same way every time, write it down.

---

## 3. Defensive LLM Response Handling

**Problem**: LLM responses are unpredictable; direct attribute access crashes.

**Bad**:
```python
response = result.response  # Crashes if missing
```

**Good**:
```python
response = getattr(result, 'response', "Default fallback")
```

**Key insight**: Always use `getattr()` with defaults when accessing LLM response attributes.

---

## 4. Pydantic V2 Compatibility

**Deprecated (V1)** → **Use Instead (V2)**:
| Old | New |
|-----|-----|
| `.dict()` | `.model_dump()` |
| `.json()` | `.model_dump_json()` |
| `.parse_raw()` | `.model_validate_json()` |

---

## 5. Replace print() with logging

**Problem**: `print()` statements are not configurable, don't show severity, and clutter production.

**Solution**: Use Python's `logging` module:
```python
import logging
logger = logging.getLogger(__name__)

logger.info("Normal operation")
logger.warning("Something to investigate")
logger.error("Something failed")
```

---

## 6. Project Organization

**Keep it simple**:
```
project/
├── .agent/workflows/     # AI behavior instructions (committed)
├── docs/
│   ├── active_context.md # Session state (gitignored)
│   ├── PRD.md           # Requirements
│   └── *.md             # Other docs (committed)
├── backend/
├── frontend/
└── tests/
```

**Key insight**: Don't create new folders unless necessary. Ask "does this belong in an existing location?"

---

## 7. Debug Endpoints

**Rule**: Any endpoint exposing internal state (e.g., `/api/debug/*`) should be:
1. Documented as "NOT for production"
2. Protected by environment check (`if os.getenv("DEBUG_MODE")`)
3. Or require authentication

---

# Medical-Grade Software Development

> These lessons are derived from IEC 62304, FDA SaMD guidance, HIPAA requirements, and industry best practices.

---

## 8. Safety Classification (IEC 62304)

**Framework**: Classify software based on risk of harm:

| Class | Risk Level | Example |
|-------|------------|---------|
| **A** | No injury possible | Appointment reminders |
| **B** | Non-serious injury possible | Diet tracking |
| **C** | Death or serious injury possible | Insulin dosing recommendations |

**Key insight**: Higher classification = more rigorous documentation, testing, and risk management. Antigravity is likely **Class B** (behavior change for diabetes prevention).

---

## 9. End-to-End Traceability

**Problem**: Regulators need to see that every requirement has been tested.

**Solution**: Maintain a traceability matrix:
```
Requirement → Design → Implementation → Test Case → Test Result
```

**Key insight**: If you can't trace a feature from requirement to test, it's not audit-ready.

---

## 10. Risk Management (ISO 14971)

**Required documentation**:
1. **Risk Analysis** — What could go wrong?
2. **Risk Evaluation** — How severe? How likely?
3. **Risk Control** — What mitigates it?
4. **Residual Risk** — What risk remains after controls?

**For AI/ML systems**: Include risks of:
- Incorrect predictions/recommendations
- Algorithmic bias
- Data quality issues
- Model drift over time

---

## 11. HIPAA Compliance for AI

**Key requirements**:

| Area | Requirement |
|------|-------------|
| **Data encryption** | AES-256 at rest and in transit |
| **Access control** | Role-based, audit logged |
| **De-identification** | Remove 18 HIPAA identifiers before training |
| **BAAs** | Business Associate Agreements with all vendors |
| **Consent** | Patients must know how AI uses their data |

**Key insight**: If your AI vendor doesn't have a BAA, PHI shared with them may lose HIPAA protection.

---

## 12. Audit Trails

**Problem**: Regulators need to know who did what, when.

**Solution**: Log all:
- User actions
- Data access
- AI predictions/recommendations
- System changes

**Our implementation**: `llm_interactions` table in `persistence.py` already logs LLM calls with timestamps, inputs, and outputs.

---

## 13. FDA AI/ML Guidance (2024)

**Key requirements for AI-enabled medical devices**:

1. **Predetermined Change Control Plan (PCCP)** — Document how the model can be updated post-deployment
2. **Transparency** — Explain how AI makes decisions to users
3. **Bias assessment** — Evaluate model on diverse populations
4. **Continuous monitoring** — Track real-world performance

**Key insight**: FDA now expects a plan for how your AI will evolve, not just what it does at launch.

---

## 14. Privacy-Enhancing Technologies

**Techniques to consider**:

| Technique | Description | Use Case |
|-----------|-------------|----------|
| **Federated Learning** | Train models without sharing raw data | Multi-site studies |
| **Differential Privacy** | Add noise to protect individuals | Aggregate analytics |
| **Homomorphic Encryption** | Compute on encrypted data | Cloud processing |

---

## 15. Debug Endpoints in Production

**Rule**: Any endpoint exposing internal state must be:
1. Disabled by default in production
2. Protected by authentication
3. Logged when accessed

**Implementation**:
```python
@app.get("/api/debug/state/{user_id}")
async def get_state_debug(user_id: str):
    if not os.getenv("DEBUG_MODE"):
        raise HTTPException(status_code=404, detail="Not found")
    # ... rest of endpoint
```

---

## Authoritative Resources

| Resource | URL |
|----------|-----|
| **IEC 62304** | Medical device software lifecycle standard |
| **ISO 14971** | Risk management for medical devices |
| **FDA SaMD Guidance** | [fda.gov/medical-devices](https://www.fda.gov/medical-devices) |
| **FDA AI/ML Guidance (2024)** | Search "FDA predetermined change control plan" |
| **HIPAA Journal** | [hipaajournal.com](https://www.hipaajournal.com/) |
| **Greenlight Guru** | [greenlight.guru](https://www.greenlight.guru/) — IEC 62304 guides |

---

## Adding New Lessons

When you discover a new pattern, add it here with:
1. **Problem**: What went wrong or was inefficient
2. **Solution**: What fixed it
3. **Key insight**: The transferable principle

---

*Last updated: 2026-01-27*
