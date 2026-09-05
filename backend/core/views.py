from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ContactSubmission, VerificationRecord, BlogPost
from .serializers import (
    ContactSubmissionSerializer,
    VerificationRecordSerializer,
    BlogPostListSerializer,
    BlogPostDetailSerializer,
)


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


class BlogPostListView(generics.ListAPIView):
    """GET /api/blog/ — published posts, newest first."""

    queryset = BlogPost.objects.filter(published=True)
    serializer_class = BlogPostListSerializer


class BlogPostDetailView(generics.RetrieveAPIView):
    """GET /api/blog/<slug>/ — a single published post."""

    queryset = BlogPost.objects.filter(published=True)
    serializer_class = BlogPostDetailSerializer
    lookup_field = 'slug'
