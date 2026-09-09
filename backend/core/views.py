from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import filters, generics, status, viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    ContactSubmission,
    VerificationRecord,
    BlogPost,
    ServiceGroup,
    TeamMember,
    Testimonial,
    Client,
    Industry,
    CaseStudy,
    TechStackItem,
    ProcessStep,
    FAQ,
)
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
    ClientPublicSerializer,
    ClientAdminSerializer,
    IndustryPublicSerializer,
    IndustryAdminSerializer,
    CaseStudyListSerializer,
    CaseStudyDetailSerializer,
    CaseStudyAdminSerializer,
    TechStackItemPublicSerializer,
    TechStackItemAdminSerializer,
    ProcessStepPublicSerializer,
    ProcessStepAdminSerializer,
    FAQPublicSerializer,
    FAQAdminSerializer,
)


class AdminPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100


class BlogPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 50


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


class ClientListView(generics.ListAPIView):
    """GET /api/clients/ — published client logos in display order."""

    queryset = Client.objects.filter(published=True)
    serializer_class = ClientPublicSerializer


class IndustryListView(generics.ListAPIView):
    """GET /api/industries/ — published industries in display order."""

    queryset = Industry.objects.filter(published=True)
    serializer_class = IndustryPublicSerializer


class CaseStudyListView(generics.ListAPIView):
    """GET /api/case-studies/ — published case studies in display order."""

    queryset = CaseStudy.objects.filter(published=True)
    serializer_class = CaseStudyListSerializer


class CaseStudyDetailView(generics.RetrieveAPIView):
    """GET /api/case-studies/<slug>/ — a single published case study."""

    queryset = CaseStudy.objects.filter(published=True)
    serializer_class = CaseStudyDetailSerializer
    lookup_field = 'slug'


class TechStackItemListView(generics.ListAPIView):
    """GET /api/tech-stack/ — published tech stack items in display order."""

    queryset = TechStackItem.objects.filter(published=True)
    serializer_class = TechStackItemPublicSerializer


class ProcessStepListView(generics.ListAPIView):
    """GET /api/process-steps/ — published process steps in display order."""

    queryset = ProcessStep.objects.filter(published=True)
    serializer_class = ProcessStepPublicSerializer


class FAQListView(generics.ListAPIView):
    """GET /api/faqs/ — published FAQs in display order."""

    queryset = FAQ.objects.filter(published=True)
    serializer_class = FAQPublicSerializer


class BlogPostListView(generics.ListAPIView):
    """GET /api/blog/ — published posts, newest first. Paginated, 6/page."""

    queryset = BlogPost.objects.filter(published=True)
    serializer_class = BlogPostListSerializer
    pagination_class = BlogPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'excerpt']


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
        response = Response({'username': request.user.username, 'email': request.user.email})
        response['Cache-Control'] = 'no-store'
        return response


class ChangePasswordView(APIView):
    """POST /api/auth/change-password/ — { current_password, new_password }."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        current_password = request.data.get('current_password', '')
        new_password = request.data.get('new_password', '')

        if not request.user.check_password(current_password):
            return Response({'detail': 'Current password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(new_password, user=request.user)
        except DjangoValidationError as exc:
            return Response({'detail': ' '.join(exc.messages)}, status=status.HTTP_400_BAD_REQUEST)

        request.user.set_password(new_password)
        request.user.save()
        update_session_auth_hash(request, request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)


class BlogPostAdminViewSet(viewsets.ModelViewSet):
    """CRUD at /api/admin/blog/ — all posts, published or not. Staff-only."""

    queryset = BlogPost.objects.all()
    serializer_class = BlogPostAdminSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    lookup_field = 'slug'
    pagination_class = AdminPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'excerpt', 'submitter_name', 'submitter_email']


class ContactSubmissionAdminViewSet(viewsets.ModelViewSet):
    """/api/admin/contact/ — view submissions and toggle `handled`. No create/full update."""

    http_method_names = ['get', 'patch', 'delete', 'head', 'options']
    queryset = ContactSubmission.objects.all()
    serializer_class = ContactSubmissionAdminSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = AdminPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'email', 'message']


class VerificationRecordAdminViewSet(viewsets.ModelViewSet):
    """CRUD at /api/admin/verify/ — all verification records. Staff-only."""

    queryset = VerificationRecord.objects.all()
    serializer_class = VerificationRecordAdminSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'code'
    pagination_class = AdminPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['code', 'holder_name']


class ServiceGroupAdminViewSet(viewsets.ModelViewSet):
    """CRUD at /api/admin/services/ — service groups shown on the Services page."""

    queryset = ServiceGroup.objects.all()
    serializer_class = ServiceGroupAdminSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    pagination_class = AdminPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class TeamMemberAdminViewSet(viewsets.ModelViewSet):
    """CRUD at /api/admin/team/ — team members shown on the About page."""

    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberAdminSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    pagination_class = AdminPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'role']


class TestimonialAdminViewSet(viewsets.ModelViewSet):
    """CRUD at /api/admin/testimonials/ — all testimonials, published or not."""

    queryset = Testimonial.objects.all()
    serializer_class = TestimonialAdminSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    pagination_class = AdminPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'org', 'quote']


class ClientAdminViewSet(viewsets.ModelViewSet):
    """CRUD at /api/admin/clients/ — all clients, published or not."""

    queryset = Client.objects.all()
    serializer_class = ClientAdminSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    pagination_class = AdminPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class IndustryAdminViewSet(viewsets.ModelViewSet):
    """CRUD at /api/admin/industries/ — all industries, published or not."""

    queryset = Industry.objects.all()
    serializer_class = IndustryAdminSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = AdminPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']


class CaseStudyAdminViewSet(viewsets.ModelViewSet):
    """CRUD at /api/admin/case-studies/ — all case studies, published or not."""

    queryset = CaseStudy.objects.all()
    serializer_class = CaseStudyAdminSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    pagination_class = AdminPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'client_name']


class TechStackItemAdminViewSet(viewsets.ModelViewSet):
    """CRUD at /api/admin/tech-stack/ — all tech stack items, published or not."""

    queryset = TechStackItem.objects.all()
    serializer_class = TechStackItemAdminSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    pagination_class = AdminPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class ProcessStepAdminViewSet(viewsets.ModelViewSet):
    """CRUD at /api/admin/process-steps/ — all process steps, published or not."""

    queryset = ProcessStep.objects.all()
    serializer_class = ProcessStepAdminSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = AdminPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description']


class FAQAdminViewSet(viewsets.ModelViewSet):
    """CRUD at /api/admin/faqs/ — all FAQs, published or not."""

    queryset = FAQ.objects.all()
    serializer_class = FAQAdminSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = AdminPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['question', 'answer']


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
            'clients_total': Client.objects.count(),
            'industries_total': Industry.objects.count(),
            'case_studies_total': CaseStudy.objects.count(),
            'tech_stack_total': TechStackItem.objects.count(),
            'process_steps_total': ProcessStep.objects.count(),
            'faqs_total': FAQ.objects.count(),
        })
