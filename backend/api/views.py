# backend/api/views.py
import os
import openai
import threading
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import DocumentJob
from .serializers import DocumentJobSerializer, ChatRequestSerializer
from .tasks import process_document_job
from .utils import extract_text_from_file

class DocumentJobViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing, creating, and interacting with DocumentJobs.
    """
    queryset = DocumentJob.objects.all().order_by('-created_at')
    serializer_class = DocumentJobSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        job = serializer.save()
        thread = threading.Thread(target=process_document_job, args=(job.id,))
        thread.start()

    @action(detail=True, methods=['post'], url_path='chat')
    def chat(self, request, pk=None):
        """
        Custom action to handle conversational chat about a specific document.
        """
        job = self.get_object() # Get the specific DocumentJob instance
        
        # Validate the incoming request data
        request_serializer = ChatRequestSerializer(data=request.data)
        if not request_serializer.is_valid():
            return Response(request_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        prompt = request_serializer.validated_data['prompt']
        history = request_serializer.validated_data.get('history', [])

        # Check if the document exists and has been processed
        if job.status != DocumentJob.Status.SUCCESS or not job.document:
            return Response(
                {"error": "Document is not ready for chat or does not exist."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            # 1. Get the document context
            document_text = extract_text_from_file(job.document.path)
            if not document_text:
                raise ValueError("Failed to extract text from document.")

            # 2. Format the messages for OpenAI
            system_message = {
                "role": "system",
                "content": f"You are a helpful assistant. The user is asking questions about a document. This is the document's full text:\n\n---\n{document_text}\n\n---\n\nAnswer the user's questions based on this document."
            }
            
            # Convert history to the correct format
            formatted_history = [{"role": item['role'], "content": item['content']} for item in history]

            user_message = {"role": "user", "content": prompt}
            
            messages = [system_message] + formatted_history + [user_message]
            
            # 3. Call OpenAI
            client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
            response = client.chat.completions.create(
                model="gpt-4o", # Using a more advanced model for better Q&A
                messages=messages
            )
            ai_reply = response.choices[0].message.content

            return Response({"reply": ai_reply}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error in chat action for job {pk}: {e}")
            return Response({"error": "An internal error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
