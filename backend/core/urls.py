from django.urls import path
from .views import (
    ContactSubmissionCreateView,
    VerifyRecordView,
    BlogPostListView,
    BlogPostDetailView,
)

urlpatterns = [
    path('contact/', ContactSubmissionCreateView.as_view(), name='contact-create'),
    path('verify/<str:code>/', VerifyRecordView.as_view(), name='verify-record'),
    path('blog/', BlogPostListView.as_view(), name='blog-list'),
    path('blog/<slug:slug>/', BlogPostDetailView.as_view(), name='blog-detail'),
]
