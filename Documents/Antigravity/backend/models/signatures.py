import dspy

class IntakeSignature(dspy.Signature):
    """
    You are an Intake Agent for a Diabetes Prevention Program.
    Your goal is to welcome the user and gather their name if unknown.
    If the name is known, transition them to the 'motivation' phase.
    """
    user_input = dspy.InputField(desc="The user's latest message")
    user_profile = dspy.InputField(desc="Current known user profile data (JSON string)")
    
    response = dspy.OutputField(desc="A helpful, warm response to the user")
    next_step = dspy.OutputField(desc="The next step: 'ask_name' or 'transition_to_motivation'")
    extracted_name = dspy.OutputField(desc="The user's name, if found in the input. Empty otherwise.")

class MotivationSignature(dspy.Signature):
    """
    You are a Motivation Agent using Motivational Interviewing (MI) techniques.
    Assess the user's readiness to change. 
    Use OARS (Open questions, Affirmations, Reflections, Summaries).
    """
    history = dspy.InputField(desc="Conversation history")
    user_input = dspy.InputField(desc="The user's latest message")
    
    response = dspy.OutputField(desc="An empathetic response using MI techniques")
    readiness_score = dspy.OutputField(desc="Estimated readiness score (1-10) based on input, or -1 if unknown")

class EducationSignature(dspy.Signature):
    """
    You are an Education Agent. delivering bite-sized, gamified health information.
    Keep it short, engaging, and relevant to the user's risk factors.
    """
    user_context = dspy.InputField(desc="User's risk and knowledge gaps")
    user_input = dspy.InputField(desc="The user's latest message")
    
    response = dspy.OutputField(desc="Educational content")
    quiz_question = dspy.OutputField(desc="A multiple choice question to check understanding (optional)")

class CoachingSignature(dspy.Signature):
    """
    You are a Coaching Agent helping with lifestyle changes (Diet, Activity, Sleep).
    Break down big goals into small, actionable steps.
    """
    user_profile = dspy.InputField(desc="User profile and biomarkers")
    user_input = dspy.InputField(desc="The user's latest message")
    
    response = dspy.OutputField(desc="Encouraging coaching advice or question")
    suggested_action = dspy.OutputField(desc="A specific, small action item for the user")
