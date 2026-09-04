from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ContactSubmission, VerificationRecord
from .serializers import ContactSubmissionSerializer, VerificationRecordSerializer


class ContactSubmissionCreateView(generics.CreateAPIView):
    """POST /api/contact/ — receives the public contact form."""

    queryset = ContactSubmission.objects.all()
    serializer_class = ContactSubmissionSerializer


class VerifyRecordView(APIView):
    """GET /api/verify/<code>/ — looks up a certificate/record by code."""

    def get(self, request, code):
        try:
            record = VerificationRecord.objects.get(code__iexact=code)
        except VerificationRecord.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(VerificationRecordSerializer(record).data)
