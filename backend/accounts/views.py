from rest_framework import generics
from .serializers import RegistrationSerializer
from users.models import CustomUser
from rest_framework.throttling import AnonRateThrottle


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegistrationSerializer
    

class LoginRateThrottle(AnonRateThrottle):
    rate = "5/minute"