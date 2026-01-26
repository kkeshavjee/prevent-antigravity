# PREVENT Dawn: AI-Driven Diabetes Prevention Research Platform

**PREVENT Dawn** is a digital health research platform designed to develop and validate next-generation behavioral interventions. It serves as a sandbox for exploring how multi-agent AI systems can support patients at risk of diabetes.

It is named **Dawn** to symbolize a new beginning and hope for patients.

## 🔬 Research & Vision
This platform is intended for researching:
*   **Novel Behavioral Interventions**: Testing scalable, AI-driven coaching based on Motivational Interviewing and the Transtheoretical Model.
*   **Specialized AI Agents**: Orchestrating a team of agents (Nutrition, Activity, Stress) that collaborate to deliver personalized care.
*   **Automated Clinical Validation**: Future capabilities will include an autonomous "Scientist Agent" to facilitate **Randomized Controlled Trials (RCTs)**, allowing the system to run, measure, and validate interventions in real-time.

## Key Features

### 1. Prismatic Dashboard
- **Wellness Strata Visualization**: A premium, "Prismatic" interface that visualizes health data through glassmorphism and subtle animations.
- **Diabetes Risk Strata**: An interactive risk speedometer providing real-time feedback on clinical biomarkers.
- **Wellness Insights**: Replaces clinical scoring with qualitative "Core Strengths" and "Growth Nodes" extracted from conversations.
- **Unified Health ID**: Securely connects users to their personalized clinical profile via a physician-issued access code.

### 2. Agentic Chat (Dawn)
- **Neural Coach Integration**: A conversational AI (Dawn) that performs agentic assessments of motivation, barriers, and facilitators.
- **Dynamic Personalization**: Dawn extracts qualitative insights (facilitators/barriers) during the conversation and updates the dashboard in real-time.
- **Motivational Interviewing**: Uses OARS (Open questions, Affirmations, Reflections, Summaries) to guide users through their health journey without rigid questionnaires.

### 3. Integrated Research Framework
- **Multi-Agent Orchestration**: A backend system that routes conversations between Intake, Motivation, Education, and Coaching agents.
- **Persistence Strata**: Full state management ensuring that conversation history and psychographic assessments persist across sessions.

## Tech Stack
- **Frontend**: React (Vite), TypeScript, Framer Motion (Animations), Tailwind CSS.
- **Backend**: Python FastAPI, DSPy (LLM Orchestration).
- **LLM**: Gemini 1.5 Flash (via Google AI Studio).

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
2.  Make the scripts executable: `chmod +x start_app.sh stop_app.sh`
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
- **v2.0 (Prismatic Layer)**:
    - Shifted to **Agentic Motivation Assessment** (Chat-based).
    - Introduced the **Prismatic UI** (Glassmorphism, Outfit/Inter typography).
    - Added **Wellness Insights** (Strengths/Growth Nodes) for natural motivation.
    - Implemented global bottom navigation and mobile optimizations.

## Contributing
We use the **Task Decoupled Planning (TDP)** methodology for all development. Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) and the [TDP Protocol](docs/process/TDP_DEV_PROTOCOL.md) before submitting PRs.
