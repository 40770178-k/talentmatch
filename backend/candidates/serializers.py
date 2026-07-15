from rest_framework import serializers
from users.models import CandidateProfile, Skill


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name"]


class CandidateProfileSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)
    skill_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Skill.objects.all(),
        write_only=True,
        source="skills"
    )

    class Meta:
        model = CandidateProfile
        fields = [
            "id",
            "full_name",
            "location",
            "bio",
            "years_of_experience",
            "github_url",
            "linkedin_url",
            "skills",
            "skill_ids",
        ]

from users.models import CandidateProfile, Skill, RecruiterProfile


class RecruiterProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruiterProfile
        fields = [
            "id",
            "company_name",
            "company_website",
            "company_description",
            "company_location",
        ]