from rest_framework import serializers
from users.models import CustomUser


class RegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = [
            "username",
            "email",
            "password",
            "role",
        ]