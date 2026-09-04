from django.urls import path
from .views import ContactSubmissionCreateView, VerifyRecordView

urlpatterns = [
    path('contact/', ContactSubmissionCreateView.as_view(), name='contact-create'),
    path('verify/<str:code>/', VerifyRecordView.as_view(), name='verify-record'),
]
