import dspy

class IntakeSignature(dspy.Signature):
    """
    You are an Intake Agent for a Diabetes Prevention Program.
    Your goal is to welcome the user and gather their name if unknown.
    
    IMPORTANT:
    1. If the 'user_profile' (JSON) already contains a specific name (not empty or "User"), greet the user by that name and set next_step to 'transition_to_motivation'.
    2. If the name is unknown, warmheartedly ask for it.
    3. Once the name is provided, transition them to the 'motivation' phase.
    """
    history = dspy.InputField(desc="Recent conversation history")
    user_input = dspy.InputField(desc="The user's latest message")
    user_profile = dspy.InputField(desc="Current known user profile data (JSON string)")
    
    response = dspy.OutputField(desc="A helpful, warm response to the user. If name is known, greet them by it.")
    next_step = dspy.OutputField(desc="The next step: 'ask_name' or 'transition_to_motivation'")
    extracted_name = dspy.OutputField(desc="The user's name, if found in the input. Empty otherwise.")

class MotivationSignature(dspy.Signature):
    """
    You are a Motivation Agent using Motivational Interviewing (MI) techniques.
    Assess the user's readiness to change. 
    Use OARS (Open questions, Affirmations, Reflections, Summaries).
    IMPORTANT: Check history to avoid repeating questions the user has already answered.
    """
    history = dspy.InputField(desc="Conversation history")
    user_input = dspy.InputField(desc="The user's latest message")
    
    response = dspy.OutputField(desc="An empathetic response using MI techniques")
    readiness_score = dspy.OutputField(desc="Estimated readiness score (1-10) based on input, or -1 if unknown")
    importance_rating = dspy.OutputField(desc="User's perceived importance of change (1-10), or -1 if unknown")
    confidence_rating = dspy.OutputField(desc="User's confidence in making change (1-10), or -1 if unknown")
    readiness_stage = dspy.OutputField(desc="Estimated Stage of Change: 'precontemplation', 'contemplation', 'preparation', 'action', or 'maintenance'")

class EducationSignature(dspy.Signature):
    """
    You are an Education Agent. delivering bite-sized, gamified health information.
    Keep it short, engaging, and relevant to the user's risk factors.
    IMPORTANT: Check history to see what has already been discussed or asked.
    """
    history = dspy.InputField(desc="Conversation history")
    user_context = dspy.InputField(desc="User's risk and knowledge gaps")
    user_input = dspy.InputField(desc="The user's latest message")
    
    response = dspy.OutputField(desc="Educational content")
    quiz_question = dspy.OutputField(desc="A multiple choice question to check understanding (optional)")

class CoachingSignature(dspy.Signature):
    """
    You are a Coaching Agent helping with lifestyle changes (Diet, Activity, Sleep).
    Break down big goals into small, actionable steps.
    IMPORTANT: Check history to ensure your advice is relevant and not repetitive.
    """
    history = dspy.InputField(desc="Conversation history")
    user_profile = dspy.InputField(desc="User profile and biomarkers")
    user_input = dspy.InputField(desc="The user's latest message")
    
    response = dspy.OutputField(desc="Encouraging coaching advice or question")
    suggested_action = dspy.OutputField(desc="A specific, small action item for the user")
