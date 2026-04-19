from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO

class PDFGenerator:
    @staticmethod
    def generate_student_report(student_name: str, grades: list) -> BytesIO:
        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        p.setFont("Helvetica-Bold", 16)
        p.drawString(100, height - 50, f"Student Performance Report: {student_name}")
        
        p.setFont("Helvetica", 12)
        y = height - 100
        p.drawString(100, y, "Subject | Marks | Percentage")
        y -= 20
        p.line(100, y, 500, y)
        y -= 20

        for g in grades:
            p.drawString(100, y, f"{g['subject']} | {g['marks']} | {g['percentage']}%")
            y -= 20
            if y < 50:
                p.showPage()
                y = height - 50

        p.save()
        buffer.seek(0)
        return buffer

    @staticmethod
    def generate_paper_pdf(title: str, content: str) -> BytesIO:
        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        p.setFont("Helvetica-Bold", 16)
        p.drawString(100, height - 50, title)
        
        p.setFont("Helvetica", 12)
        y = height - 80
        
        # Simple text wrapping logic
        lines = content.split('\n')
        for line in lines:
            if y < 50:
                p.showPage()
                y = height - 50
            p.drawString(100, y, line)
            y -= 15

        p.save()
        buffer.seek(0)
        return buffer
