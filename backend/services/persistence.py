import aiosqlite
import json
import os
from backend.models.data_models import AgentState, PatientProfile, Message, RiskLevel, Biomarkers

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "antigravity.db")

class AsyncPersistence:
    def __init__(self):
        self.db_path = DB_PATH

    async def init_db(self):
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                CREATE TABLE IF NOT EXISTS user_states (
                    user_id TEXT PRIMARY KEY,
                    current_agent TEXT,
                    conversation_history TEXT,
                    patient_profile TEXT,
                    context_variables TEXT,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            await db.commit()

    async def save_state(self, user_id: str, state: AgentState):
        async with aiosqlite.connect(self.db_path) as db:
            # Serialize complex objects
            history_json = json.dumps([m.dict() for m in state.conversation_history])
            profile_json = state.patient_profile.json()
            context_json = json.dumps(state.context_variables)
            
            await db.execute("""
                INSERT OR REPLACE INTO user_states 
                (user_id, current_agent, conversation_history, patient_profile, context_variables)
                VALUES (?, ?, ?, ?, ?)
            """, (user_id, state.current_agent, history_json, profile_json, context_json))
            await db.commit()

    async def load_state(self, user_id: str) -> AgentState:
        async with aiosqlite.connect(self.db_path) as db:
            cursor = await db.execute("SELECT current_agent, conversation_history, patient_profile, context_variables FROM user_states WHERE user_id = ?", (user_id,))
            row = await cursor.fetchone()
            
            if not row:
                return None
                
            current_agent, history_raw, profile_raw, context_raw = row
            
            # Robustness: Handle NULL current_agent
            if not current_agent:
                print(f"Persistence WARNING: Found NULL current_agent for user {user_id}. Defaulting to 'intake'.")
                current_agent = "intake"
            
            # Deserialize
            history = [Message(**m) for m in json.loads(history_raw)]
            profile = PatientProfile.parse_raw(profile_raw)
            context = json.loads(context_raw)
            
            return AgentState(
                current_agent=current_agent,
                conversation_history=history,
                patient_profile=profile,
                context_variables=context
            )
