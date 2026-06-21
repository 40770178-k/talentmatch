from rest_framework import generics, permissions
from users.permissions import IsRecruiter, IsCandidate
from .models import Application
from .serializers import (
    ApplicationCreateSerializer,
    ApplicationSerializer,
    ApplicationStatusUpdateSerializer,
)


class ApplicationListCreateView(generics.ListCreateAPIView):
    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated(), IsCandidate()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ApplicationCreateSerializer
        return ApplicationSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role == "recruiter":
            return Application.objects.filter(job__recruiter=user)

        return Application.objects.filter(candidate=user)

    def perform_create(self, serializer):
        serializer.save(candidate=self.request.user)


class ApplicationStatusUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = ApplicationStatusUpdateSerializer

    def get_permissions(self):
        return [permissions.IsAuthenticated(), IsRecruiter()]

    def get_queryset(self):
        user = self.request.user
        return Application.objects.filter(job__recruiter=user)