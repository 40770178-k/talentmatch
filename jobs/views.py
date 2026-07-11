from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import models
from users.permissions import IsRecruiter
from applications.models import Application
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
    


class RecruiterDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsRecruiter]

    def get(self, request):
        recruiter = request.user

        # Get all jobs by this recruiter
        jobs = Job.objects.filter(recruiter=recruiter)
        total_jobs = jobs.count()
        open_jobs = jobs.filter(status="open").count()
        closed_jobs = jobs.filter(status="closed").count()

        # Get all applications for this recruiter's jobs
        applications = Application.objects.filter(
            job__recruiter=recruiter
        )
        total_applications = applications.count()
        pending = applications.filter(status="pending").count()
        reviewed = applications.filter(status="reviewed").count()
        interview = applications.filter(status="interview").count()
        rejected = applications.filter(status="rejected").count()
        accepted = applications.filter(status="accepted").count()

        # Top jobs by application count
        top_jobs = jobs.annotate(
            application_count=models.Count("applications")
        ).order_by("-application_count")[:5].values(
            "id", "title", "application_count", "status"
        )

        return Response({
            "jobs": {
                "total": total_jobs,
                "open": open_jobs,
                "closed": closed_jobs,
            },
            "applications": {
                "total": total_applications,
                "pending": pending,
                "reviewed": reviewed,
                "interview": interview,
                "rejected": rejected,
                "accepted": accepted,
            },
            "top_jobs": list(top_jobs),
        })