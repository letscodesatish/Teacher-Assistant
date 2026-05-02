from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import json
import os
from dotenv import load_dotenv

# Explicitly load the .env file located in the backend directory
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)

from backend.core.db import SessionLocal, init_db, Student, Attendance, StudentEmbedding, Syllabus, Grade, Exam, Assignment, QuestionPaper, User
from backend.core.face_logic import FaceManager
from backend.core.ai_logic import AIContentGenerator
from backend.core.pdf_gen import PDFGenerator
from backend.core.auth import verify_password, get_password_hash, create_access_token
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from backend.core.whatsapp_logic import whatsapp_gateway
from backend.core.mongodb import list_group_links, save_group_link, ClassGroupLink
import httpx

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
    # Seed a default teacher if not exists
    db = SessionLocal()
    if not db.query(User).filter(User.email == "teacher@school.com").first():
        hashed_pw = get_password_hash("password123")
        db.add(User(email="teacher@school.com", password=hashed_pw, name="Dr. Satish Sharma"))
        db.commit()
    db.close()

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

@app.get("/syllabus/subjects")
def get_subjects(db: Session = Depends(get_db)):
    subjects = db.query(Syllabus.subject).distinct().all()
    return [s[0] for s in subjects]

@app.get("/syllabus/topics")
def get_topics(subject: str, db: Session = Depends(get_db)):
    topics = db.query(Syllabus).filter(Syllabus.subject == subject).all()
    return topics

@app.post("/ai/generate-paper")
async def generate_paper(topic: str, difficulty: str = "Medium", db: Session = Depends(get_db)):
    content = await ai_gen.generate_question_paper(topic, difficulty)
    # Save to QuestionPaper table
    new_paper = QuestionPaper(
        title=f"Exam: {topic} ({difficulty})",
        subject="AI-Generated", # Could be refined
        topics=topic,
        difficulty=difficulty,
        content=content
    )
    db.add(new_paper)
    db.commit()
    db.refresh(new_paper)
    return {"content": content, "paper_id": new_paper.id}

@app.get("/question-papers")
def get_papers(db: Session = Depends(get_db)):
    return db.query(QuestionPaper).order_by(QuestionPaper.created_at.desc()).all()

@app.get("/question-papers/{paper_id}")
def get_paper(paper_id: int, db: Session = Depends(get_db)):
    paper = db.query(QuestionPaper).filter(QuestionPaper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    return paper

@app.get("/question-papers/export/{paper_id}")
async def export_paper(paper_id: int, db: Session = Depends(get_db)):
    from fastapi.responses import StreamingResponse
    paper = db.query(QuestionPaper).filter(QuestionPaper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    
    pdf_buf = PDFGenerator.generate_paper_pdf(paper.title, paper.content)
    return StreamingResponse(
        pdf_buf, 
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=paper_{paper_id}.pdf"}
    )

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

# --- Auth & Profile ---
@app.post("/register")
async def register(data: dict, db: Session = Depends(get_db)):
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(password)
    new_user = User(email=email, password=hashed_password, name=name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = create_access_token(data={"sub": email, "id": new_user.id})
    return {"status": "success", "token": token, "user": {"id": new_user.id, "email": new_user.email, "name": new_user.name}}

@app.post("/login")
async def login(data: dict, db: Session = Depends(get_db)):
    email = data.get("email")
    password = data.get("password")
    user = db.query(User).filter(User.email == email).first()
    
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(data={"sub": email, "id": user.id})
    return {"status": "success", "token": token, "user": {"id": user.id, "email": user.email, "name": user.name}}

@app.post("/auth/google-login")
async def google_login(data: dict, db: Session = Depends(get_db)):
    token = data.get("token")
    # In a real app, you'd get CLIENT_ID from env
    CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    
    try:
        # Verify the Google token
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), CLIENT_ID)
        
        email = idinfo['email']
        name = idinfo.get('name')
        google_id = idinfo['sub']
        avatar = idinfo.get('picture')
        
        # Check if user exists
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            # Create new user
            user = User(
                email=email, 
                name=name, 
                google_id=google_id, 
                avatar_url=avatar
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # Update user if they didn't have google_id linked
            if not user.google_id:
                user.google_id = google_id
                user.avatar_url = avatar
                db.commit()

        jwt_token = create_access_token(data={"sub": email, "id": user.id})
        return {"status": "success", "token": jwt_token, "user": {"id": user.id, "email": user.email, "name": user.name, "avatar": user.avatar_url}}
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Google token")

@app.get("/profile")
def get_profile(db: Session = Depends(get_db)):
    # For demo, return the first teacher
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Add some stats
    stats = {
        "syllabus_count": db.query(Syllabus).count(),
        "syllabus_completed": db.query(Syllabus).filter(Syllabus.is_completed == True).count(),
        "assignments_count": db.query(Assignment).count(),
        "question_papers_count": db.query(QuestionPaper).count()
    }
    
    return {
        "user": {"id": user.id, "email": user.email, "name": user.name},
        "stats": stats
    }

# --- Exams Module ---
@app.get("/exams")
def get_exams(db: Session = Depends(get_db)):
    return db.query(Exam).order_by(Exam.date_time.asc()).all()

@app.post("/send-python-exam-notice")
async def send_python_notice(payload: dict):
    """
    Simplified Python-Only Logic. No subject checking.
    Expects payload with section, exam_date, group_id, and notice_data.
    """
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    pdf_api_url = f"{frontend_url}/api/pdf/generate"

    group_id = payload.get("group_id")
    notice_data = payload.get("notice_data", {})
    
    print(f"DEBUG: Using WhatsApp Group ID: {group_id}")
    async with httpx.AsyncClient(timeout=15.0) as client:
        # 1. Generate PDF
        try:
            pdf_res = await client.post(pdf_api_url, json=notice_data)
            if pdf_res.status_code != 200:
                raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {pdf_res.text}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"PDF Generation Service Unreachable: {str(e)}")
        
        pdf_info = pdf_res.json()
        pdf_base64 = pdf_info.get("base64")
        pdf_url = pdf_info.get("fullUrl")
        
        # 2. Send to WhatsApp
        document_payload = pdf_base64 if pdf_base64 else pdf_url

        whatsapp_res = await whatsapp_gateway.send_document(
            group_id=group_id,
            document_url=document_payload,
            filename=f"Python_MidTerm_Schedule_{notice_data.get('noticeRef', 'Notice')}.pdf",
            caption="Attention Students: The official schedule for the upcoming Python Mid-Term exams has been posted. Please find the attached PDF."
        )
        
        if whatsapp_res.get("error"):
            raise HTTPException(status_code=400, detail=f"WhatsApp API Error: {whatsapp_res.get('error')}")
            
        return {"status": "success", "message": "Python Notice Dispatched", "whatsapp_response": whatsapp_res}

@app.get("/whatsapp/groups")
async def get_whatsapp_groups():
    """
    Fetch all available WhatsApp groups for the teacher to link.
    """
    groups = await whatsapp_gateway.fetch_groups()
    
    # Add the user's specific number to the list so they can select it
    groups.insert(0, {
        "id": "6387224435@c.us",
        "name": "My Personal Number (6387224435)"
    })
    
    return groups

@app.get("/whatsapp/links")
async def get_links(teacher_id: str = "default_teacher"):
    """
    Fetch all existing class-to-group links.
    """
    links = await list_group_links(teacher_id)
    return links

@app.post("/whatsapp/link")
async def link_group(link_data: ClassGroupLink):
    """
    Create or update a class-to-group link.
    """
    await save_group_link(link_data)
    return {"status": "success"}
