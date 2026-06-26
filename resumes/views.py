from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from users.permissions import IsCandidate
from .models import Resume
from .serializers import ResumeSerializer


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
        # Deactivate previous resumes before saving the new one
        Resume.objects.filter(
            candidate=self.request.user,
            is_active=True
        ).update(is_active=False)

        serializer.save(
            candidate=self.request.user,
            original_filename=self.request.data.get("file").name,
        )