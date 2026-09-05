from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ContactSubmissionCreateView,
    VerifyRecordView,
    ServiceGroupListView,
    BlogPostListView,
    BlogPostDetailView,
    BlogPostAdminViewSet,
    ContactSubmissionAdminViewSet,
    VerificationRecordAdminViewSet,
    ServiceGroupAdminViewSet,
    AdminStatsView,
    CsrfCookieView,
    LoginView,
    LogoutView,
    MeView,
)

admin_router = DefaultRouter()
admin_router.register('blog', BlogPostAdminViewSet, basename='admin-blog')
admin_router.register('contact', ContactSubmissionAdminViewSet, basename='admin-contact')
admin_router.register('verify', VerificationRecordAdminViewSet, basename='admin-verify')
admin_router.register('services', ServiceGroupAdminViewSet, basename='admin-services')

urlpatterns = [
    path('contact/', ContactSubmissionCreateView.as_view(), name='contact-create'),
    path('verify/<str:code>/', VerifyRecordView.as_view(), name='verify-record'),
    path('services/', ServiceGroupListView.as_view(), name='services-list'),
    path('blog/', BlogPostListView.as_view(), name='blog-list'),
    path('blog/<slug:slug>/', BlogPostDetailView.as_view(), name='blog-detail'),
    path('auth/csrf/', CsrfCookieView.as_view(), name='auth-csrf'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('auth/me/', MeView.as_view(), name='auth-me'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('admin/', include(admin_router.urls)),
]
