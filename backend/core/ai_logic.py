import google.generativeai as genai
import os
from typing import Optional

class AIContentGenerator:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None

    async def generate_assignment(self, topic: str) -> str:
        """Generates a structured assignment from a topic."""
        prompt = f"Generate a detailed student assignment on the topic: '{topic}'. Include a summary, 5 key learning objectives, and 3 tasks."
        
        if not self.model:
            return f"[MOCK] Assignment for {topic}: \n1. Research the basics.\n2. Write a summary.\n3. Present findings."
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating assignment: {str(e)}"

    async def generate_question_paper(self, topic: str, difficulty: str = "Medium") -> str:
        """Generates a full question paper."""
        prompt = f"Create a {difficulty} level question paper on '{topic}'. Include 5 MCQs, 3 Short Answer Questions, and 1 Long Answer Question."
        
        if not self.model:
            return f"[MOCK] Question Paper: {topic}\nSection A: MCQs...\nSection B: Short Answers..."
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating paper: {str(e)}"
