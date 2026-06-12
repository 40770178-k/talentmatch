from rest_framework import generics
from .serializers import RegistrationSerializer
from users.models import CustomUser


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegistrationSerializer