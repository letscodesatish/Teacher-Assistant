from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, Date, Time, DateTime, Text, ForeignKey, Numeric
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

Base = declarative_base()

class Student(Base):
    __tablename__ = 'students'
    id = Column(Integer, primary_key=True)
    roll_number = Column(String(20), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    section = Column(String(10))
    email = Column(String(100))
    whatsapp_number = Column(String(15))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    attendance = relationship("Attendance", back_populates="student")
    grades = relationship("Grade", back_populates="student")
    embeddings = relationship("StudentEmbedding", back_populates="student")

class StudentEmbedding(Base):
    __tablename__ = 'student_embeddings'
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey('students.id'))
    # Storing embedding as a string or list logic depends on the specific vec store,
    # for local demo we use a Text field to store JSON string of the list
    embedding_json = Column(Text) 
    updated_at = Column(DateTime, default=datetime.utcnow)
    
    student = relationship("Student", back_populates="embeddings")

class Attendance(Base):
    __tablename__ = 'attendance'
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey('students.id'))
    date = Column(Date, default=datetime.utcnow().date)
    time = Column(Time, default=datetime.utcnow().time)
    status = Column(String(10)) # Present, Absent, Late
    latitude = Column(Float)
    longitude = Column(Float)
    is_geofenced = Column(Boolean, default=False)
    
    student = relationship("Student", back_populates="attendance")

class Syllabus(Base):
    __tablename__ = 'syllabus'
    id = Column(Integer, primary_key=True)
    subject = Column(String(100), nullable=False)
    topic = Column(String(200), nullable=False)
    is_completed = Column(Boolean, default=False)
    completion_date = Column(DateTime)

class Exam(Base):
    __tablename__ = 'exams'
    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    date_time = Column(DateTime, nullable=False)
    subject = Column(String(100))
    
    grades = relationship("Grade", back_populates="exam")

class Grade(Base):
    __tablename__ = 'grades'
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey('students.id'))
    exam_id = Column(Integer, ForeignKey('exams.id'))
    marks_obtained = Column(Float)
    total_marks = Column(Float)
    
    student = relationship("Student", back_populates="grades")
    exam = relationship("Exam", back_populates="grades")

# Database setup (using SQLite for local demo, easy to swap to PostgreSQL)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./teacher_assistant.db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
