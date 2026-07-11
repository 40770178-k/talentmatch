from django.urls import path
from .views import JobListCreateView, JobDetailView, RecruiterDashboardView

urlpatterns = [
    path("", JobListCreateView.as_view(), name="job-list"),
    path("<int:pk>/", JobDetailView.as_view(), name="job-detail"),
    path(
        "dashboard/",
        RecruiterDashboardView.as_view(),
        name="recruiter-dashboard"
    ),
]