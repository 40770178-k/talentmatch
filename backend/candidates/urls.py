from django.urls import path
from .views import CandidateProfileView, RecruiterProfileView

urlpatterns = [
    path(
        "profile/",
        CandidateProfileView.as_view(),
        name="candidate-profile"
    ),

     path(
        "recruiter/profile/",
        RecruiterProfileView.as_view(),
        name="recruiter-profile"
    ),
]