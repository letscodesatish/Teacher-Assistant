from backend.core.db import SessionLocal, init_db, Student, StudentEmbedding, Syllabus
import json
import random
from datetime import datetime

def seed():
    init_db()
    db = SessionLocal()
    
    # Add Students
    students_data = [
        {"name": "Rahul Sharma", "roll": "CS001", "email": "rahul@example.com"},
        {"name": "Priya Patel", "roll": "CS002", "email": "priya@example.com"},
        {"name": "Amit Kumar", "roll": "CS003", "email": "amit@example.com"},
        {"name": "Sneha Reddy", "roll": "CS004", "email": "sneha@example.com"},
        {"name": "Vikram Singh", "roll": "CS005", "email": "vikram@example.com"},
    ]
    
    for s_info in students_data:
        # Check if exists
        exists = db.query(Student).filter(Student.roll_number == s_info["roll"]).first()
        if not exists:
            student = Student(
                name=s_info["name"],
                roll_number=s_info["roll"],
                email=s_info["email"],
                section="A"
            )
            db.add(student)
            db.flush() # Get ID
            
            # Add a mock embedding (512 random floats for demo)
            # In real use, these would be generated from photos
            mock_embedding = [random.uniform(-1, 1) for _ in range(512)]
            db.add(StudentEmbedding(
                student_id=student.id,
                embedding_json=json.dumps(mock_embedding)
            ))
            print(f"Added student: {student.name}")

    # Add Syllabus Topics
    syllabus_topics = [
        {"subject": "Python", "topic": "Variables and Data Types"},
        {"subject": "Python", "topic": "Control Structures"},
        {"subject": "Python", "topic": "Functions and Modules"},
        {"subject": "Python", "topic": "File I/O"},
        {"subject": "AI", "topic": "Introduction to Neural Networks"},
        {"subject": "AI", "topic": "Computer Vision Basics"},
    ]
    
    for t in syllabus_topics:
        exists = db.query(Syllabus).filter(Syllabus.topic == t["topic"]).first()
        if not exists:
            db.add(Syllabus(subject=t["subject"], topic=t["topic"]))
            print(f"Added syllabus topic: {t['topic']}")

    # Add Assignments
    assignments = [
        {"title": "Introduction to AI", "description": "Write a 500 word essay on the history of Artificial Intelligence.", "subject": "AI"},
        {"title": "Python Basics", "description": "Complete the exercises in Chapter 1 of the Python handbook.", "subject": "Computer Science"}
    ]
    from backend.core.db import Assignment, Exam, Grade
    for a in assignments:
        exists = db.query(Assignment).filter(Assignment.title == a["title"]).first()
        if not exists:
            db.add(Assignment(title=a["title"], description=a["description"], subject=a["subject"]))
            print(f"Added assignment: {a['title']}")

    # Add Exams
    exams = [
        {"title": "Mid-Term Python", "subject": "Python", "date": datetime(2024, 6, 15, 10, 0)},
        {"title": "Final AI Concepts", "subject": "AI", "date": datetime(2024, 7, 20, 14, 0)}
    ]
    for ex in exams:
        exists = db.query(Exam).filter(Exam.title == ex["title"]).first()
        if not exists:
            new_ex = Exam(title=ex["title"], subject=ex["subject"], date_time=ex["date"])
            db.add(new_ex)
            db.flush()
            # Add some grades for this exam
            students = db.query(Student).limit(3).all()
            for s in students:
                db.add(Grade(student_id=s.id, exam_id=new_ex.id, marks_obtained=random.randint(60, 95), total_marks=100))
            print(f"Added exam and grades: {ex['title']}")

    db.commit()
    db.close()
    print("Seeding complete.")

if __name__ == "__main__":
    seed()
