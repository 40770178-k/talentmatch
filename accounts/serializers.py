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

    def create(self, validated_data):
     user = CustomUser.objects.create_user(
        username=validated_data["username"],
        email=validated_data["email"],
        password=validated_data["password"],
        role=validated_data["role"],
    )

     return user