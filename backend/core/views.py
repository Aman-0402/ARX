from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ContactSubmission, VerificationRecord, BlogPost
from .serializers import (
    ContactSubmissionSerializer,
    VerificationRecordSerializer,
    BlogPostListSerializer,
    BlogPostDetailSerializer,
    BlogPostAdminSerializer,
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


@method_decorator(ensure_csrf_cookie, name='get')
class CsrfCookieView(APIView):
    """GET /api/auth/csrf/ — sets the csrftoken cookie for the SPA to read."""

    permission_classes = [AllowAny]

    def get(self, request):
        return Response(status=status.HTTP_204_NO_CONTENT)


class LoginView(APIView):
    """POST /api/auth/login/ — { username, password } → logs in, starts a session."""

    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username', '')
        password = request.data.get('password', '')
        user = authenticate(request, username=username, password=password)
        if user is None or not user.is_staff:
            return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_400_BAD_REQUEST)
        login(request, user)
        return Response({'username': user.username, 'email': user.email})


class LogoutView(APIView):
    """POST /api/auth/logout/ — ends the current session."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    """GET /api/auth/me/ — current session user, 401 if not logged in."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'username': request.user.username, 'email': request.user.email})


class BlogPostAdminViewSet(viewsets.ModelViewSet):
    """CRUD at /api/admin/blog/ — all posts, published or not. Staff-only."""

    queryset = BlogPost.objects.all()
    serializer_class = BlogPostAdminSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'
