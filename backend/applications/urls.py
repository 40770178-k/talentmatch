from django.urls import path
from .views import ApplicationListCreateView, ApplicationStatusUpdateView

urlpatterns = [
    path("", ApplicationListCreateView.as_view(), name="application-list"),
    path("<int:pk>/", ApplicationStatusUpdateView.as_view(), name="application-status"),
]