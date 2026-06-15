from django.db import models
from users.models import CustomUser, Skill


class Job(models.Model):

    STATUS_CHOICES = (
        ("open", "Open"),
        ("closed", "Closed"),
    )

    recruiter = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="jobs"
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255, blank=True)
    required_skills = models.ManyToManyField(Skill, blank=True)
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="open"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.recruiter.username}"