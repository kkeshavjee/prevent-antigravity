# Concept Note: PREVENT Patient Journey State Machine

To ensure clinical efficacy and personalized flow, we must formally model the patient journey as a state machine. This prevents "skipping steps" and ensures the AI context is always aligned with the relevant stage of change.

## 1. Journey Stages (The States)
The system aligns with the 6 stages of the PREVENT Journey [PRD Section 4]:

1. **IDENTIFY**: (Internal) Patient identified in EMR.
2. **INFORM**: (Outreach) Physician-endorsed invitation sent.
3. **EDUCATE & MOTIVATE**: Assessing readiness and building foundational knowledge.
4. **EXPLORE & COMMIT**: Choosing a program from "The Mall."
5. **ENGAGE**: Active habit formation and coaching.
6. **SUSTAIN**: Long-term maintenance and relapse prevention.

## 2. Transition Logic (The Triggers)
Transitions between states are non-linear but governed by specific "Achievement Conditions":

- **EDUCATE → COMMIT**: Requires a minimum "Readiness Score" (>7/10) and completion of at least 3 core knowledge modules.
- **COMMIT → ENGAGE**: Triggered by a specific selection in "The Mall" UI.
- **ENGAGE → SUSTAIN**: Based on time (e.g., 12 weeks of active engagement) or consistent biomarker improvement.

## 3. Architectural Implementation
- **Mediator Pattern**: The `Orchestrator` acts as the controller, querying the `StateMachineService` before every interaction.
- **Persistence**: The current state is stored in the `AgentState` model. If a user disappears for 2 weeks, they resume exactly at their last "checkpoint" (e.g., 50% through the EDUCATION stage).
- **Reset Logic**: Supports "Circular Change" (Stages of Change theory)—if a user relapses during SUSTAIN, the machine can move them back to MOTIVATE to restart the cycle without losing historical data.
