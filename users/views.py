from rest_framework import generics, permissions
from users.models import Skill
from users.serializers import SkillSerializer


class SkillListView(generics.ListAPIView):
    queryset = Skill.objects.all().order_by("name")
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]