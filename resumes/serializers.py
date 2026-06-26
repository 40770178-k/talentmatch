from rest_framework import serializers
from .models import Resume


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = [
            "id",
            "file",
            "original_filename",
            "is_active",
            "uploaded_at",
        ]
        read_only_fields = ["is_active", "uploaded_at"]