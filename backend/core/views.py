from django.contrib.auth import authenticate, login, logout
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import generics, status, viewsets
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ContactSubmission, VerificationRecord, BlogPost, ServiceGroup, TeamMember, Testimonial
from .serializers import (
    ContactSubmissionSerializer,
    ContactSubmissionAdminSerializer,
    VerificationRecordSerializer,
    VerificationRecordAdminSerializer,
    BlogPostListSerializer,
    BlogPostDetailSerializer,
    BlogPostAdminSerializer,
    BlogPostSubmitSerializer,
    ServiceGroupPublicSerializer,
    ServiceGroupAdminSerializer,
    TeamMemberPublicSerializer,
    TeamMemberAdminSerializer,
    TestimonialPublicSerializer,
    TestimonialAdminSerializer,
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


class ServiceGroupListView(generics.ListAPIView):
    """GET /api/services/ — service groups in display order."""

    queryset = ServiceGroup.objects.all()
    serializer_class = ServiceGroupPublicSerializer


class TeamMemberListView(generics.ListAPIView):
    """GET /api/team/ — team members in display order."""

    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberPublicSerializer


class TestimonialListView(generics.ListAPIView):
    """GET /api/testimonials/ — published testimonials in display order."""

    queryset = Testimonial.objects.filter(published=True)
    serializer_class = TestimonialPublicSerializer


class BlogPostListView(generics.ListAPIView):
    """GET /api/blog/ — published posts, newest first."""

    queryset = BlogPost.objects.filter(published=True)
    serializer_class = BlogPostListSerializer


class BlogPostDetailView(generics.RetrieveAPIView):
    """GET /api/blog/<slug>/ — a single published post."""

    queryset = BlogPost.objects.filter(published=True)
    serializer_class = BlogPostDetailSerializer
    lookup_field = 'slug'


class BlogPostSubmitView(generics.CreateAPIView):
    """POST /api/blog/submit/ — public writer submission, lands as unpublished pending review."""

    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSubmitSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        serializer.save(published=False, published_at=timezone.now())


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
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    lookup_field = 'slug'


class ContactSubmissionAdminViewSet(viewsets.ModelViewSet):
    """/api/admin/contact/ — view submissions and toggle `handled`. No create/full update."""

    http_method_names = ['get', 'patch', 'delete', 'head', 'options']
    queryset = ContactSubmission.objects.all()
    serializer_class = ContactSubmissionAdminSerializer
    permission_classes = [IsAuthenticated]


class VerificationRecordAdminViewSet(viewsets.ModelViewSet):
    """CRUD at /api/admin/verify/ — all verification records. Staff-only."""

    queryset = VerificationRecord.objects.all()
    serializer_class = VerificationRecordAdminSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'code'


class ServiceGroupAdminViewSet(viewsets.ModelViewSet):
    """CRUD at /api/admin/services/ — service groups shown on the Services page."""

    queryset = ServiceGroup.objects.all()
    serializer_class = ServiceGroupAdminSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class TeamMemberAdminViewSet(viewsets.ModelViewSet):
    """CRUD at /api/admin/team/ — team members shown on the About page."""

    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberAdminSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class TestimonialAdminViewSet(viewsets.ModelViewSet):
    """CRUD at /api/admin/testimonials/ — all testimonials, published or not."""

    queryset = Testimonial.objects.all()
    serializer_class = TestimonialAdminSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class AdminStatsView(APIView):
    """GET /api/admin/stats/ — counts for the dashboard overview."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'blog_total': BlogPost.objects.count(),
            'blog_published': BlogPost.objects.filter(published=True).count(),
            'blog_draft': BlogPost.objects.filter(published=False).count(),
            'contact_total': ContactSubmission.objects.count(),
            'contact_unhandled': ContactSubmission.objects.filter(handled=False).count(),
            'verification_total': VerificationRecord.objects.count(),
            'service_groups_total': ServiceGroup.objects.count(),
            'team_total': TeamMember.objects.count(),
            'testimonials_total': Testimonial.objects.count(),
        })
