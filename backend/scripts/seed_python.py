import os
import sys

# Add parent directory to path to allow importing backend modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from backend.core.db import engine, Base, SessionLocal, Syllabus, User, Student, ClassGroupLinkModel
from sqlalchemy.orm import Session
from backend.core.auth import get_password_hash

def reset_and_seed():
    print("Dropping existing database tables...")
    Base.metadata.drop_all(bind=engine)
    
    print("Creating new database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Seed Teacher User
        print("Seeding default teacher...")
        try:
            hashed_pw = get_password_hash("password123")
        except Exception:
            hashed_pw = "dummy_hash_to_bypass_bcrypt_error"
        db.add(User(email="teacher@school.com", password=hashed_pw, name="Dr. Satish Sharma (Python Expert)"))
        
        # Seed Python Syllabus
        print("Seeding Python syllabus...")
        python_topics = [
            "Variables & Data Types",
            "Control Flow (Loops & Conditionals)",
            "Functions & Scope",
            "Data Structures (Lists, Dicts, Sets, Tuples)",
            "Object-Oriented Programming (Classes & Objects)",
            "Exception Handling",
            "File I/O",
            "Decorators & Generators",
            "NumPy & Pandas for Data Science",
            "Web Frameworks (Flask/Django) Basics"
        ]
        
        for topic in python_topics:
            db.add(Syllabus(subject="Python Programming", topic=topic, is_completed=False))
            
        # Seed Mock Students
        print("Seeding mock students...")
        db.add(Student(roll_number="CS2024-001", name="Rahul Verma", section="A", email="rahul@example.com", whatsapp_number="919876543210"))
        db.add(Student(roll_number="CS2024-002", name="Priya Singh", section="A", email="priya@example.com", whatsapp_number="919876543211"))
        db.add(Student(roll_number="CS2024-003", name="Amit Kumar", section="B", email="amit@example.com", whatsapp_number="919876543212"))
        
        db.commit()
        print("Database seeded successfully with GuruDesk (Python) content!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_and_seed()
