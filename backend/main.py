from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import json

from .core.db import SessionLocal, init_db, Student, Attendance, StudentEmbedding, Syllabus, Grade, Exam, Assignment
from .core.face_logic import FaceManager
from .core.ai_logic import AIContentGenerator
from .core.pdf_gen import PDFGenerator

app = FastAPI(title="Teacher Assistant API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DB on startup
@app.on_event("startup")
def on_startup():
    init_db()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

face_mgr = FaceManager()
ai_gen = AIContentGenerator()

@app.get("/")
def read_root():
    return {"message": "Welcome to Teacher Assistant API"}

# --- Attendance Module ---
@app.post("/attendance/scan")
async def scan_attendance(
    image: UploadFile = File(...), 
    lat: float = Form(...), 
    lng: float = Form(...),
    db: Session = Depends(get_db)
):
    # 1. Geofencing Check (Target: Lat 28.5, Lng 77.2 as example)
    target_lat, target_lng = 28.5, 77.2
    dist = ((lat - target_lat)**2 + (lng - target_lng)**2)**0.5
    is_inside = dist < 0.001 # approx 100m
    
    # 2. Face Recognition
    img_bytes = await image.read()
    scan_vec = face_mgr.get_embedding(img_bytes)
    
    if not scan_vec:
        raise HTTPException(status_code=400, detail="No face detected in scan")

    # Fetch all student embeddings from DB
    db_recs = db.query(StudentEmbedding).all()
    records = [{"student_id": r.student_id, "embedding": json.loads(r.embedding_json)} for r in db_recs]
    
    match_id = face_mgr.verify_faces(scan_vec, records)
    
    if match_id:
        attendance = Attendance(
            student_id=match_id, 
            status="Present", 
            latitude=lat, 
            longitude=lng,
            is_geofenced=is_inside
        )
        db.add(attendance)
        db.commit()
        return {"status": "success", "student_id": match_id, "geofenced": is_inside}
    else:
        return {"status": "not_recognized"}

# --- AI Content Module ---
@app.post("/ai/generate-assignment")
async def generate_assignment(topic: str, db: Session = Depends(get_db)):
    content = await ai_gen.generate_assignment(topic)
    # Automatically save generated assignment to DB
    new_asn = Assignment(
        title=f"AI Generated: {topic}",
        description=content,
        subject="General",
        is_ai_generated=True
    )
    db.add(new_asn)
    db.commit()
    db.refresh(new_asn)
    return {"content": content, "assignment_id": new_asn.id}

@app.post("/ai/generate-paper")
async def generate_paper(topic: str):
    content = await ai_gen.generate_question_paper(topic)
    return {"content": content}

# --- Assignments Module ---
@app.get("/assignments")
def get_assignments(db: Session = Depends(get_db)):
    from .core.db import Assignment
    return db.query(Assignment).order_by(Assignment.created_at.desc()).all()

@app.post("/assignments")
def create_assignment(title: str, description: str, subject: str, db: Session = Depends(get_db)):
    from .core.db import Assignment
    new_asn = Assignment(title=title, description=description, subject=subject)
    db.add(new_asn)
    db.commit()
    db.refresh(new_asn)
    return new_asn

@app.get("/assignments/export/{asn_id}")
async def export_assignment(asn_id: int, db: Session = Depends(get_db)):
    from .core.db import Assignment
    from fastapi.responses import StreamingResponse
    asn = db.query(Assignment).filter(Assignment.id == asn_id).first()
    if not asn:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    pdf_buf = PDFGenerator.generate_paper_pdf(asn.title, asn.description)
    return StreamingResponse(
        pdf_buf, 
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=assignment_{asn_id}.pdf"}
    )

# --- Syllabus Module ---
@app.get("/syllabus")
def get_syllabus(db: Session = Depends(get_db)):
    return db.query(Syllabus).all()

@app.post("/syllabus/toggle/{item_id}")
def toggle_syllabus(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Syllabus).filter(Syllabus.id == item_id).first()
    if item:
        item.is_completed = not item.is_completed
        db.commit()
        return item
    raise HTTPException(status_code=404, detail="Item not found")

# --- Grades Module ---
@app.get("/grades/summary")
def get_grades_summary(db: Session = Depends(get_db)):
    # Aggregated query joining Students, Exams and Grades
    results = db.query(
        Student.name.label("student_name"),
        Student.roll_number,
        Exam.title.label("exam_title"),
        Grade.marks_obtained,
        Grade.total_marks
    ).join(Grade, Student.id == Grade.student_id)\
     .join(Exam, Grade.exam_id == Exam.id).all()
    
    return [
        {
            "student_name": r.student_name,
            "roll_number": r.roll_number,
            "exam_title": r.exam_title,
            "marks_obtained": r.marks_obtained,
            "total_marks": r.total_marks,
            "percentage": (r.marks_obtained / r.total_marks) * 100 if r.total_marks > 0 else 0
        } for r in results
    ]

@app.get("/grades/{student_id}")
def get_student_grades(student_id: int, db: Session = Depends(get_db)):
    return db.query(Grade).filter(Grade.student_id == student_id).all()

# --- Exams Module ---
@app.get("/exams")
def get_exams(db: Session = Depends(get_db)):
    return db.query(Exam).order_by(Exam.date_time.asc()).all()
