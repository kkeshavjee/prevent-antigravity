import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv("backend/.env")
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("GOOGLE_API_KEY not found.")
else:
    genai.configure(api_key=api_key)
    try:
        print("Available models:")
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
    except Exception as e:
        print(f"Error listing models: {e}")
