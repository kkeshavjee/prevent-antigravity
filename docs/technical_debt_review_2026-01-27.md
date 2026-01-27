# Technical Debt Code Review
**Date**: 2026-01-27  
**Status**: Findings documented, awaiting action

---

## Summary
A code review was conducted focusing on technical debt across the Python backend. The review identified 7 items across 3 priority levels.

---

## Critical Issues (P0 - Address Soon)

### 1. Inconsistent Defensive Attribute Access
**Files**: `backend/agents/education_agent.py`, `backend/agents/coaching_agent.py`

| Agent | Issue |
|-------|-------|
| `EducationAgent` | **Unsafe** - Uses `result.response` and `result.quiz_question` directly (L15-16) |
| `CoachingAgent` | **Unsafe** - Uses `result.response` and `result.suggested_action` directly (L15-16) |
| `IntakeAgent` | ✅ Uses `getattr()` defensively |
| `MotivationAgent` | ✅ Uses `getattr()` defensively |

**Risk**: If the LLM returns an incomplete response, `EducationAgent` and `CoachingAgent` will crash.

**Fix Pattern** (from `motivation_agent.py`):
```python
response_text = getattr(result, 'response', "I'm listening. Tell me more.")
quiz_question = getattr(result, 'quiz_question', None)
```

---

### 2. Deprecated Pydantic V1 Methods
**File**: `backend/services/persistence.py`

| Line | Current Code | Pydantic V2 Equivalent |
|------|--------------|------------------------|
| 44 | `m.dict()` | `m.model_dump()` |
| 45 | `state.patient_profile.json()` | `state.patient_profile.model_dump_json()` |
| 72 | `PatientProfile.parse_raw(profile_raw)` | `PatientProfile.model_validate_json(profile_raw)` |

**Risk**: Pydantic will emit deprecation warnings, and these will break in Pydantic V3.

---

## Medium Issues (P1)

### 3. Debug `print()` Statements in Production Code
Found **45+ print statements** across core production files:

| File | Count | Notes |
|------|-------|-------|
| `backend/agents/intake_agent.py` | 5 | Debug logging for agent flow |
| `backend/orchestrator/orchestrator.py` | 6 | Info about transitions |
| `backend/main.py` | 5 | Startup and error logging |
| `backend/services/persistence.py` | 1 | NULL current_agent warning |
| `backend/services/llm_config.py` | 3 | Configuration status |
| `backend/services/data_loader.py` | 4 | Load warnings/errors |

**Recommendation**: Replace with proper `logging` module (already used in `mcp_server.py`).

---

### 4. Unfinished TODO
**File**: `backend/main.py:107`
```python
suggested_actions=[] # TODO: Add actions support
```

---

### 5. Debug Endpoint Not Protected
**File**: `backend/main.py` (L149-161)

The `/api/debug/state/{user_id}` endpoint exposes internal state:
- No authentication
- Exposes current agent, stage, and history count
- Comment says "NOT for production use" but no guards exist

---

## Low Issues (P2 - Nice to Have)

### 6. Silent Exception Swallowing
**File**: `backend/agents/motivation_agent.py` (L39-40)
```python
except (ValueError, TypeError):
    pass  # Silent fail
```
This hides parsing errors that might indicate upstream issues.

---

### 7. Retry Logic Catches All Exceptions
**File**: `backend/mcp_server/mcp_server.py` (L27-30)
```python
@retry(
    retry=retry_if_exception_type(Exception),  # Too broad
    ...
)
```
Should be more specific (e.g., `RateLimitError`, `ConnectionError`).

---

## Actionable Items Checklist

- [ ] **P0**: Add defensive `getattr()` to `EducationAgent` and `CoachingAgent` (~15 min)
- [ ] **P0**: Migrate `persistence.py` to Pydantic V2 methods (~10 min)
- [ ] **P1**: Replace `print()` with `logging` in all agents & orchestrator (~30 min)
- [ ] **P1**: Implement `suggested_actions` or remove TODO (~20 min)
- [ ] **P1**: Add authentication/env guard to debug endpoint (~15 min)
- [ ] **P2**: Log parsing errors in `motivation_agent.py` instead of silent `pass` (~5 min)
- [ ] **P2**: Narrow retry exception types in MCP server (~10 min)

---

## Next Steps
When resuming, start with P0 items (defensive attribute access + Pydantic migration) as they're quick wins that prevent potential runtime crashes.
