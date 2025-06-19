# api/serializers.py

from rest_framework import serializers
from .models import DocumentJob

class DocumentJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentJob
        # We specify the fields we want to include in the API representation.
        # 'read_only_fields' are fields that are set by the server, not the client.
        fields = ['id', 'status', 'document', 'result', 'created_at', 'updated_at']
        read_only_fields = ['id', 'status', 'result', 'created_at', 'updated_at']
        
# NEW: Serializer for a single message in the chat history
class ChatHistorySerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=["user", "assistant"])
    content = serializers.CharField()

# NEW: Serializer for the incoming chat request from the frontend
class ChatRequestSerializer(serializers.Serializer):
    prompt = serializers.CharField()
    history = ChatHistorySerializer(many=True, required=False)