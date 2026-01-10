from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from enum import Enum

class RiskLevel(str, Enum):
    LOW = "Low"
    MODERATE = "Moderate"
    HIGH = "High"

class Biomarkers(BaseModel):
    a1c: float
    fbs: float
    systolic_bp: int
    diastolic_bp: int
    ldl: float
    hdl: float
    total_cholesterol: float
    weight: float
    height: float

class PatientProfile(BaseModel):
    user_id: str
    name: str
    age: int
    diabetes_risk_score: RiskLevel
    risk_score_numeric: int # 0-100
    biomarkers: Biomarkers
    psychographics: Dict[str, Any] = {}
    motivation_level: str = "Unknown" # Precontemplation, Contemplation, etc.
    physician_name: Optional[str] = "Dr. Smith"

class Message(BaseModel):
    role: str # 'user', 'assistant', 'system'
    content: str
    timestamp: Optional[str] = None

class AgentState(BaseModel):
    current_agent: str # 'intake', 'motivation', 'education', 'coaching'
    conversation_history: List[Message]
    patient_profile: PatientProfile
    context_variables: Dict[str, Any] = {}

class OrchestratorRequest(BaseModel):
    user_id: str
    user_input: str

class OrchestratorResponse(BaseModel):
    response: str
    suggested_actions: List[str] = []
