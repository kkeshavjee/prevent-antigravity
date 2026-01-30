---
description: Check the current backend configuration and LLM stack priority
---

1. Query the backend configuration info endpoint to verify which LLM provider is active:

// turbo
```powershell
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/config/info" -Method Get -ErrorAction Stop
    Write-Host "`n=== ANTIGRAVITY BRAIN STATUS ===" -ForegroundColor Cyan
    Write-Host "Connectivity:     $($response.brain_connectivity)" -ForegroundColor Green
    Write-Host "Primary Provider: $($response.primary_provider)" -ForegroundColor Yellow
    Write-Host "Failover Enabled: $($response.failover_enabled)"
    Write-Host "Priority Stack:"
    $response.llm_priority_stack | ForEach-Object { Write-Host "  -> $_" -ForegroundColor Gray }
    Write-Host "================================`n" -ForegroundColor Cyan
} catch {
    Write-Host "Error connecting to backend: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Ensure the backend is running: python -m uvicorn backend.main:app --reload"
}
```
