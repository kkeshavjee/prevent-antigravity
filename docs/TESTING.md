# Testing Guide

This document describes the integration testing setup for the Antigravity project.

## Quick Start

```powershell
# Run all integration tests
python -m pytest tests/integration/test_api_v1.py -v

# Run a specific test
python -m pytest tests/integration/test_api_v1.py::test_full_journey_progression -v

# Run with detailed output on failures
python -m pytest tests/integration/test_api_v1.py -v --tb=long
```

## Test Environment

### Database Isolation
Tests use a separate database (`test_antigravity.db`) to avoid affecting production data. This is controlled by:
- **Environment Variable**: `ANTIGRAVITY_DB` - set automatically by `tests/conftest.py`
- The test database is created fresh at the start of each session and cleaned up afterward.

### LLM Mocking
All LLM calls are mocked to:
1. Prevent API credit consumption during testing
2. Ensure deterministic, reproducible test results
3. Allow simulation of edge cases (rate limits, malformed responses)

**Key Implementation Detail**: The mock patches `backend.mcp_server.mcp_server.dspy.Predict` (not just `dspy.Predict`) because Python mocking requires patching at the *import location*, not the definition.

## Test Architecture

### conftest.py Fixtures

| Fixture | Scope | Purpose |
|---------|-------|---------|
| `setup_test_env` | function, autouse | Sets `ANTIGRAVITY_DB` env var |
| `init_test_db` | session, autouse | Creates fresh test database |
| `global_llm_mock` | function, autouse | Mocks `dspy.Predict` globally |

### Using the Global Mock

Tests that need custom mock behavior should:
1. Accept `global_llm_mock` as a fixture parameter
2. Reconfigure the mock, don't create a new patch

```python
def test_custom_behavior(client, global_llm_mock):
    # Create your custom response object
    class CustomResult:
        response = "Custom response"
        next_step = "transition_to_motivation"
    
    # Reconfigure the global mock
    mock_instance = MagicMock()
    mock_instance.return_value = CustomResult()
    global_llm_mock.return_value = mock_instance
    
    # Now make your API call
    response = client.post("/api/chat", json={...})
```

**⚠️ Do NOT use `with patch("...")` for dspy.Predict** - it will conflict with the global fixture.

## Test Cases

### 1. `test_health_and_pseudonymized_lookup`
**PRD Requirement**: 4.6 (Privacy) - No PII should leak

Verifies:
- `/health` endpoint returns 200
- Patient lookup returns pseudonymized data
- Response does NOT contain `email` or `phone`

### 2. `test_audit_trail_persistence`
**PRD Requirement**: 10.1 (The Receipt)

Verifies:
- Chat interactions are logged to the database
- Conversation history is persisted correctly

### 3. `test_full_journey_progression`
**PRD Requirement**: State Machine (Identify → Sustain)

Verifies:
- New users start at `intake` agent
- With proper mock response, users transition to `motivation` agent
- Debug endpoint correctly reports state

### 4. `test_resilience_rate_limiting`
**PRD Requirement**: 5 (Resilience)

Verifies:
- When LLM throws "429 Quota Exceeded", API returns HTTP 429
- Response contains "Rate Limit" in error detail

### 5. `test_malformed_llm_recovery`
**PRD Requirement**: 5 (Resilience)

Verifies:
- Malformed LLM responses don't crash the server (no 500)
- Fallback message is returned to user

## Debug Endpoint

For testing purposes, a debug endpoint is available:

```
GET /api/debug/state/{user_id}
```

Returns:
```json
{
  "user_id": "test_user",
  "current_agent": "intake",
  "current_stage": "Identify",
  "history_count": 4
}
```

**⚠️ This endpoint is for development/testing only. Remove before production deployment.**

## Troubleshooting

### "No module named pytest"
```powershell
pip install pytest
```

### "No module named aiosqlite/httpx/etc"
```powershell
pip install aiosqlite httpx fastapi dspy
```

### Mock not working / real LLM calls happening
Check that you're patching at the correct location:
- ✅ `backend.mcp_server.mcp_server.dspy.Predict`
- ❌ `dspy.Predict`

### Test pollution / state leaking between tests
Ensure each test uses a unique `user_id`:
```python
import uuid
user_id = f"test_user_{uuid.uuid4().hex[:8]}"
```

## Adding New Tests

1. Place test files in `tests/integration/`
2. Use the `client` fixture for API calls
3. Use `global_llm_mock` fixture for custom LLM behavior
4. Always use unique user IDs
5. Document which PRD requirement the test covers
