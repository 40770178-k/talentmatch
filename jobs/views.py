from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Job
from .serializers import JobSerializer


class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "recruiter":
            return Job.objects.filter(recruiter=user)

        return Job.objects.filter(status="open")

    def perform_create(self, serializer):
        if self.request.user.role != "recruiter":
            raise PermissionDenied(
                "Only recruiters can post jobs."
            )
        serializer.save(recruiter=self.request.user)


class JobDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "recruiter":
            return Job.objects.filter(recruiter=user)

        return Job.objects.filter(status="open")