# api/urls.py
from django.urls import path
from .views import DocumentJobListCreateView, DocumentJobDetailView

urlpatterns = [
    path('jobs/', DocumentJobListCreateView.as_view(), name='job-list-create'),
    path('jobs/<int:pk>/', DocumentJobDetailView.as_view(), name='job-detail'),
]