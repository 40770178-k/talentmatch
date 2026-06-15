from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from users.models import CandidateProfile
from .serializers import CandidateProfileSerializer


class CandidateProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = CandidateProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user

        if user.role != "candidate":
            raise PermissionDenied(
                "Only candidates can access this profile."
            )

        profile, created = CandidateProfile.objects.get_or_create(
            user=user
        )

        return profile
    
from users.models import CandidateProfile, RecruiterProfile
from .serializers import CandidateProfileSerializer, RecruiterProfileSerializer


class RecruiterProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = RecruiterProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user

        if user.role != "recruiter":
            raise PermissionDenied(
                "Only recruiters can access this profile."
            )

        profile, created = RecruiterProfile.objects.get_or_create(
            user=user
        )

        return profile