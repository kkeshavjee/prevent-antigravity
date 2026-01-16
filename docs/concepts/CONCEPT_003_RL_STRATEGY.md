# Concept Note: RL Strategy for Motivation Optimization

The `MotivationAgent` currently uses static DSPy prompts. To achieve the PRD goal of "learned personalization," we will implement a Reinforcement Learning (RL) layer that discovers the most effective "hook" for each individual user.

## 1. The RL Components
- **The Agent:** The `MotivationAgent` choosing a strategy.
- **The Observation (State):** 
    - Patient psychographics (e.g., "Skeptic", "Optimist").
    - Current Stage of Change (TTM).
    - Sentiment of the last 3 user messages.
- **The Action Space:** 
    - **Logical Appeal:** (Focus on data/biomarkers).
    - **Emotional Appeal:** (Focus on family/longevity).
    - **Social Proof:** (Focus on peer success stories).
    - **Gamification:** (Focus on point/badges).
- **The Reward Signal:**
    - **Immediate:** User engagement (response length, positive sentiment).
    - **Long-term:** Increase in "Readiness Score" or program commitment.

## 2. Implementation: "Epsilon-Greedy" Exploration
- **Phase 1 (Exploration):** For the first few interactions, the bot randomly tries different appeals.
- **Phase 2 (Exploitation):** As it learns that a user responds best to *Social Proof*, it biases its actions toward that strategy while still occasionally trying others to ensure the preference hasn't changed.

## 3. Feedback Loop
1. **Interaction**: User sends a message.
2. **Decision**: RL Model selects the "Strategy Hook."
3. **Generation**: DSPy uses that hook to generate the response.
4. **Scoring**: The bot evaluates the user's next response for "Engagement Increase."
5. **Update**: RL "weights" are adjusted to favor the successful strategy.
