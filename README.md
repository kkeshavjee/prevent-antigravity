# Antigravity: Diabetes Prevention Platform

Antigravity is a digital health intervention system designed to help patients prevent diabetes through personalized readiness assessments and AI-driven coaching.

## Key Features

### 1. Patient Dashboard
- **Personalized Overview**: Displays patient name, allocated physician (e.g., Dr. Smith), and key health metrics.
- **Health Metrics**: Visualizes Diabetes Risk Score, A1c, FBS, and Weight.
- **Readiness Profile**: Shows the user's current stage of change, confidence, and importance ratings after assessment.
- **Patient Lookup**: Securely connects users to their specific profile and doctor based on their name.

### 2. Readiness Assessment
- **Psychometric Evaluation**: Assesses the user's readiness to change based on the Transtheoretical Model.
- **Scoring**: Calculates a "Stage of Change" (Precontemplation, Contemplation, Preparation, Action, Maintenance).
- **Persistence**: Results are saved locally, allowing users to leave and return without losing progress.

### 3. AI Coaching Chat
- **Motivational Interviewing**: An AI coach uses therapeutic techniques to discuss the user's results.
- **Context-Aware**: The chat is aware of the user's specific stage and scores, tailoring questions and reflections accordingly.

## Tech Stack
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, shadcn/ui.
- **Backend**: Python FastAPI.
- **Deployment**: Netlify (Frontend).

## Getting Started

### Prerequisites
- Node.js & npm
- Python 3.9+

### Quick Start (Windows)
For Windows users, convenience scripts are provided to start the application components:

- **Frontend**: Double-click `run_frontend.bat` or run it from the terminal.
- **Backend**: Double-click `run_backend.bat` or run it from the terminal.
- **Initial Setup**: Run `setup_frontend.bat` to install dependencies.

### Manual Installation

1.  **Clone the repo**:
    ```bash
    git clone <repository_url>
    ```
2.  **Setup Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
3.  **Setup Backend**:
    ```bash
    cd backend
    pip install -r requirements.txt
    python main.py
    ```

## Development History
- **v1.0**: Initial Release with Readiness Assessment, Dashboard, and basic Chat.
- **Update (Jan 2026)**:
    - Renamed "Motivation" to "Readiness".
    - Added global bottom navigation.
    - Implemented Patient Lookup and Profile Persistence.
    - Fixed UI/UX issues (scrolling, button overlaps).
