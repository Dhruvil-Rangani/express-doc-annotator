from django.shortcuts import render

from rest_framework import generics
from .models import DocumentJob
from .serializers import DocumentJobSerializer
import threading # Import threading
from .tasks import process_document_job
from rest_framework.parsers import MultiPartParser, FormParser

class DocumentJobListCreateView(generics.ListCreateAPIView):
    queryset = DocumentJob.objects.all().order_by('-created_at')
    serializer_class = DocumentJobSerializer
    parser_classes = [MultiPartParser, FormParser]  # Allow file uploads

    # This method is called when a new object is created.
    def perform_create(self, serializer):
        print("Received request data:", self.request.data)
        # First, save the object as usual to get an ID
        job = serializer.save()

        # Then, start the background task
        thread = threading.Thread(target=process_document_job, args=(job.id,))
        thread.start()


class DocumentJobDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API View to retrieve a single document job.
    - GET /api/jobs/<id>/ -> Returns a single job's details.
    - DELETE /api/jobs/<id>/
    """
    queryset = DocumentJob.objects.all()
    serializer_class = DocumentJobSerializer
