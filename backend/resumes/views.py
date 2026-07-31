from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from users.permissions import IsCandidate
from .models import Resume
from .serializers import ResumeSerializer
from .tasks import parse_resume
from rest_framework.exceptions import ValidationError

class ResumeListCreateView(generics.ListCreateAPIView):
    serializer_class = ResumeSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated(), IsCandidate()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        return Resume.objects.filter(candidate=self.request.user)




    def perform_create(self, serializer):
        Resume.objects.filter(
            candidate=self.request.user,
            is_active=True
        ).update(is_active=False)

        resume = serializer.save(
             candidate=self.request.user,
             original_filename=self.request.data.get("file").name,
        )

        parse_resume.delay(resume.id)

ALLOWED_EXTENSIONS = [".pdf", ".docx"]
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def perform_create(self, serializer):
    file = self.request.data.get("file")

    # Check file extension
    import os
    ext = os.path.splitext(file.name)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValidationError(
            "Only PDF and DOCX files are allowed."
        )

    # Check file size
    if file.size > MAX_FILE_SIZE:
        raise ValidationError(
            "File size cannot exceed 5MB."
        )

    Resume.objects.filter(
        candidate=self.request.user,
        is_active=True
    ).update(is_active=False)

    resume = serializer.save(
        candidate=self.request.user,
        original_filename=file.name,
    )

    parse_resume.delay(resume.id)