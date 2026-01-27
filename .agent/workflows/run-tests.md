---
description: Run integration tests for the Antigravity project
---

# Running Integration Tests

## Prerequisites
Ensure dependencies are installed:
```powershell
pip install pytest aiosqlite httpx fastapi dspy
```

## Run All Integration Tests
// turbo
```powershell
python -m pytest tests/integration/test_api_v1.py -v
```

## Run Specific Test
```powershell
python -m pytest tests/integration/test_api_v1.py::test_full_journey_progression -v
```

## Run with Detailed Failure Output
```powershell
python -m pytest tests/integration/test_api_v1.py -v --tb=long
```

## Expected Results
- 4 tests should pass
- 1 test may skip (if patient lookup data unavailable)

## Documentation
See `docs/TESTING.md` for full testing documentation including:
- Mock patterns and fixtures
- Troubleshooting guide
- How to add new tests
