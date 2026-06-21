from rest_framework import serializers
from .models import Application


class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ["id", "job"]
        read_only_fields = ["id"]


class ApplicationSerializer(serializers.ModelSerializer):
    candidate = serializers.StringRelatedField(read_only=True)
    job_title = serializers.CharField(source="job.title", read_only=True)

    class Meta:
        model = Application
        fields = [
            "id",
            "candidate",
            "job",
            "job_title",
            "status",
            "applied_at",
        ]
        read_only_fields = ["candidate", "job", "applied_at"]


class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ["id", "status"]
        read_only_fields = ["id"]