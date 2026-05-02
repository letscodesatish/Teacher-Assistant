from pydantic import BaseModel, Field
from typing import Optional, List
from backend.core.db import SessionLocal, ClassGroupLinkModel

class ClassGroupLink(BaseModel):
    class_name: str = Field(..., alias="className")
    subject_code: str = Field(..., alias="subjectCode")
    whatsapp_group_id: str = Field(..., alias="whatsappGroupId")
    teacher_id: str = Field(..., alias="teacherId")
    is_linked: bool = Field(default=True, alias="isLinked")

    class Config:
        allow_population_by_field_name = True

async def save_group_link(link_data: ClassGroupLink):
    db = SessionLocal()
    try:
        existing = db.query(ClassGroupLinkModel).filter(
            ClassGroupLinkModel.class_name == link_data.class_name,
            ClassGroupLinkModel.subject_code == link_data.subject_code
        ).first()
        
        if existing:
            existing.whatsapp_group_id = link_data.whatsapp_group_id
            existing.teacher_id = link_data.teacher_id
            existing.is_linked = link_data.is_linked
        else:
            new_link = ClassGroupLinkModel(
                class_name=link_data.class_name,
                subject_code=link_data.subject_code,
                whatsapp_group_id=link_data.whatsapp_group_id,
                teacher_id=link_data.teacher_id,
                is_linked=link_data.is_linked
            )
            db.add(new_link)
        db.commit()
        return True
    finally:
        db.close()

async def get_group_link(class_name: str, subject_code: str):
    db = SessionLocal()
    try:
        link = db.query(ClassGroupLinkModel).filter(
            ClassGroupLinkModel.class_name == class_name,
            ClassGroupLinkModel.subject_code == subject_code
        ).first()
        if link:
            return {
                "className": link.class_name,
                "subjectCode": link.subject_code,
                "whatsappGroupId": link.whatsapp_group_id,
                "teacherId": link.teacher_id,
                "isLinked": link.is_linked
            }
        return None
    finally:
        db.close()

async def list_group_links(teacher_id: str):
    db = SessionLocal()
    try:
        links = db.query(ClassGroupLinkModel).filter(ClassGroupLinkModel.teacher_id == teacher_id).all()
        return [
            {
                "className": l.class_name,
                "subjectCode": l.subject_code,
                "whatsappGroupId": l.whatsapp_group_id,
                "teacherId": l.teacher_id,
                "isLinked": l.is_linked
            } for l in links
        ]
    finally:
        db.close()
