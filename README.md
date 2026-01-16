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

### Quick Start

#### Windows
Double-click `start_app.bat`. This will:
1.  Check for Node.js and Python.
2.  Set up a Python virtual environment for the backend and install dependencies.
3.  Install frontend dependencies (if missing).
4.  Launch both **Backend** and **Frontend** in separate windows.

#### macOS / Linux
1.  Open Terminal.
2.  Make the script executable: `chmod +x start_app.sh`
3.  Run the script: `./start_app.sh`
    - This performs the same setup steps as the Windows version and opens new Terminal windows for the services on macOS.

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
    ```
    #### Environment Configuration
    The AI features require a Google Gemini API key.
    - Create a `.env` file in the `backend/` directory (you can use `.env.example` as a template).
    - Obtain a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    - Add the key to your `.env` file:
      ```env
      GOOGLE_API_KEY=your_api_key_here
      ```

    #### Run Backend:
    ```bash
    python main.py
    ```

## Development History
- **v1.0**: Initial Release with Readiness Assessment, Dashboard, and basic Chat.
- **Update (Jan 2026)**:
    - Renamed "Motivation" to "Readiness".
    - Added global bottom navigation.
    - Implemented Patient Lookup and Profile Persistence.
    - Fixed UI/UX issues (scrolling, button overlaps).
