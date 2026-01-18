from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.orchestrator.orchestrator import Orchestrator
from backend.models.data_models import OrchestratorRequest, OrchestratorResponse

app = FastAPI()

# Configure CORS to allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = Orchestrator()

@app.on_event("startup")
async def startup_event():
    import os
    api_key = os.getenv("GOOGLE_API_KEY")
    if api_key:
        print(f"Backend started. API Key found: {api_key[:4]}...{api_key[-4:]}")
    else:
        print("Backend started. WARNING: GOOGLE_API_KEY NOT FOUND!")

@app.post("/api/chat", response_model=OrchestratorResponse)
async def chat(request: OrchestratorRequest):
    try:
        result = await orchestrator.process_request(request.user_id, request.user_input)
        return OrchestratorResponse(
            response=result["response"],
            suggested_actions=[] # TODO: Add actions support
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from backend.services.data_loader import DataLoader
import os

# Initialize data loader (assuming file is in data/ or root)
# Adjust path as necessary. For now, using a relative path assuming execution from root
data_path = os.path.join(os.path.dirname(__file__), "data", "PREVENT_Inform_Table_V2 (2).xlsx")
# If data is in root documents, use absolute path or config
# Based on file listing, the excel is in "c:\Users\Karim Keshavjee\Documents\Antigravity\PREVENT_Inform_Table_V2 (2).xlsx"
# We should probably pass the correct path.
# Let's try to locate it relative to backend or hardcode for this user env since we know it.
EXCEL_PATH = r"c:\Users\Karim Keshavjee\Documents\Antigravity\PREVENT_Inform_Table_V2 (2).xlsx"
data_loader = DataLoader(EXCEL_PATH)

@app.get("/api/patient/lookup", response_model=OrchestratorResponse) # Using OrchestratorResponse for consistency? No, should return PatientProfile or subset.
# Let's create a wrapper or return PatientProfile directly.
async def lookup_patient(name: str):
    profile = data_loader.get_patient_by_name(name)
    if not profile:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Returning profile directly
    return profile

from backend.api.admin import router as admin_router
app.include_router(admin_router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {"message": "Diabetes Prevention Bot Backend is running!", "docs_url": "/docs"}

