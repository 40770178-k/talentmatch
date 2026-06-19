from rest_framework import generics, permissions
from users.permissions import IsRecruiter
from .models import Job
from .serializers import JobSerializer


class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated(), IsRecruiter()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user

        if user.role == "recruiter":
            return Job.objects.filter(recruiter=user)

        return Job.objects.filter(status="open")

    def perform_create(self, serializer):
        serializer.save(recruiter=self.request.user)


class JobDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = JobSerializer

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH"]:
            return [permissions.IsAuthenticated(), IsRecruiter()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user

        if user.role == "recruiter":
            return Job.objects.filter(recruiter=user)

        return Job.objects.filter(status="open")