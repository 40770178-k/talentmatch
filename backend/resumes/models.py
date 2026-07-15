from django.db import models
from users.models import CustomUser


class Resume(models.Model):
    candidate = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="resumes"
    )
    file = models.FileField(upload_to="resumes/")
    original_filename = models.CharField(max_length=255, blank=True)
    extracted_text = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.candidate.username} - {self.original_filename}"