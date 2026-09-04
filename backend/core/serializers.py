from rest_framework import serializers
from .models import ContactSubmission, VerificationRecord


class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ['id', 'name', 'email', 'phone', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']


class VerificationRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationRecord
        fields = ['code', 'holder_name', 'record_type', 'issued_on', 'notes']
