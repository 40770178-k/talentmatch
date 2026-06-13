from django.urls import path
from .views import CandidateProfileView

urlpatterns = [
    path(
        "profile/",
        CandidateProfileView.as_view(),
        name="candidate-profile"
    ),
]