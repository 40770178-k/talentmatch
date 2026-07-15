from rest_framework import serializers
from .models import Job
from users.models import Skill
from candidates.serializers import SkillSerializer


class JobSerializer(serializers.ModelSerializer):
    required_skills = SkillSerializer(many=True, read_only=True)
    skill_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Skill.objects.all(),
        write_only=True,
        source="required_skills"
    )
    recruiter = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "description",
            "location",
            "status",
            "required_skills",
            "skill_ids",
            "recruiter",
            "created_at",
        ]
        read_only_fields = ["recruiter", "created_at"]