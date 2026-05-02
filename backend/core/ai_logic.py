try:
    import google.generativeai as genai
    GOOGLE_GENAI_AVAILABLE = True
except ImportError:
    print("Warning: google-generativeai not found. Using mock AI generation.")
    GOOGLE_GENAI_AVAILABLE = False
import os
from typing import Optional

class AIContentGenerator:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if self.api_key and GOOGLE_GENAI_AVAILABLE:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None

    async def generate_assignment(self, topic: str) -> str:
        """Generates a structured assignment from a topic."""
        prompt = f"System: You are an expert Python Professor. Generate challenging coding questions only.\nGenerate a detailed student assignment on the Python topic: '{topic}'. Include a summary, 5 key learning objectives, and 3 coding tasks."
        
        if not self.model:
            return f"[MOCK] Assignment for {topic}: \n1. Research the basics.\n2. Write a summary.\n3. Present findings."
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating assignment: {str(e)}"

    async def generate_question_paper(self, topic: str, difficulty: str = "Medium") -> str:
        """Generates a full question paper."""
        prompt = f"System: You are an expert Python Professor. Generate challenging coding questions only.\nCreate a {difficulty} level question paper on the Python topic '{topic}'. Must include:\n1. 5 Multiple Choice Questions on Python logic.\n2. 3 'What is the output?' code blocks.\n3. 2 Bug-fixing exercises where students must identify a SyntaxError or LogicalError.\n4. 1 Long Answer coding task."
        
        if not self.model:
            return f"[MOCK] Question Paper: {topic}\nSection A: MCQs...\nSection B: Short Answers..."
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating paper: {str(e)}"
