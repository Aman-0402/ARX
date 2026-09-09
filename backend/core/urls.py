from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ContactSubmissionCreateView,
    VerifyRecordView,
    ServiceGroupListView,
    TeamMemberListView,
    TestimonialListView,
    ClientListView,
    IndustryListView,
    CaseStudyListView,
    CaseStudyDetailView,
    TechStackItemListView,
    ProcessStepListView,
    FAQListView,
    BlogPostListView,
    BlogPostDetailView,
    BlogPostAdminViewSet,
    BlogPostSubmitView,
    ContactSubmissionAdminViewSet,
    VerificationRecordAdminViewSet,
    ServiceGroupAdminViewSet,
    TeamMemberAdminViewSet,
    TestimonialAdminViewSet,
    ClientAdminViewSet,
    IndustryAdminViewSet,
    CaseStudyAdminViewSet,
    TechStackItemAdminViewSet,
    ProcessStepAdminViewSet,
    FAQAdminViewSet,
    AdminStatsView,
    CsrfCookieView,
    LoginView,
    LogoutView,
    MeView,
    ChangePasswordView,
)

admin_router = DefaultRouter()
admin_router.register('blog', BlogPostAdminViewSet, basename='admin-blog')
admin_router.register('contact', ContactSubmissionAdminViewSet, basename='admin-contact')
admin_router.register('verify', VerificationRecordAdminViewSet, basename='admin-verify')
admin_router.register('services', ServiceGroupAdminViewSet, basename='admin-services')
admin_router.register('team', TeamMemberAdminViewSet, basename='admin-team')
admin_router.register('testimonials', TestimonialAdminViewSet, basename='admin-testimonials')
admin_router.register('clients', ClientAdminViewSet, basename='admin-clients')
admin_router.register('industries', IndustryAdminViewSet, basename='admin-industries')
admin_router.register('case-studies', CaseStudyAdminViewSet, basename='admin-case-studies')
admin_router.register('tech-stack', TechStackItemAdminViewSet, basename='admin-tech-stack')
admin_router.register('process-steps', ProcessStepAdminViewSet, basename='admin-process-steps')
admin_router.register('faqs', FAQAdminViewSet, basename='admin-faqs')

urlpatterns = [
    path('contact/', ContactSubmissionCreateView.as_view(), name='contact-create'),
    path('verify/<str:code>/', VerifyRecordView.as_view(), name='verify-record'),
    path('services/', ServiceGroupListView.as_view(), name='services-list'),
    path('team/', TeamMemberListView.as_view(), name='team-list'),
    path('testimonials/', TestimonialListView.as_view(), name='testimonials-list'),
    path('clients/', ClientListView.as_view(), name='clients-list'),
    path('industries/', IndustryListView.as_view(), name='industries-list'),
    path('case-studies/', CaseStudyListView.as_view(), name='case-studies-list'),
    path('case-studies/<slug:slug>/', CaseStudyDetailView.as_view(), name='case-studies-detail'),
    path('tech-stack/', TechStackItemListView.as_view(), name='tech-stack-list'),
    path('process-steps/', ProcessStepListView.as_view(), name='process-steps-list'),
    path('faqs/', FAQListView.as_view(), name='faqs-list'),
    path('blog/', BlogPostListView.as_view(), name='blog-list'),
    path('blog/submit/', BlogPostSubmitView.as_view(), name='blog-submit'),
    path('blog/<slug:slug>/', BlogPostDetailView.as_view(), name='blog-detail'),
    path('auth/csrf/', CsrfCookieView.as_view(), name='auth-csrf'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('auth/me/', MeView.as_view(), name='auth-me'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='auth-change-password'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('admin/', include(admin_router.urls)),
]
