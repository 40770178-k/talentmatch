from celery import shared_task
import PyPDF2
import docx
import os


@shared_task
def parse_resume(resume_id):
    from .models import Resume

    try:
        resume = Resume.objects.get(id=resume_id)
        file_path = resume.file.path
        extracted_text = ""

        if file_path.endswith(".pdf"):
            with open(file_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    extracted_text += page.extract_text() or ""

        elif file_path.endswith(".docx"):
            doc = docx.Document(file_path)
            for paragraph in doc.paragraphs:
                extracted_text += paragraph.text + "\n"

        resume.extracted_text = extracted_text
        resume.save()

    except Resume.DoesNotExist:
        pass