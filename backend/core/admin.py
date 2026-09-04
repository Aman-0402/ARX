from django.contrib import admin
from .models import ContactSubmission, VerificationRecord


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'created_at', 'handled']
    list_filter = ['handled', 'created_at']
    search_fields = ['name', 'email', 'message']


@admin.register(VerificationRecord)
class VerificationRecordAdmin(admin.ModelAdmin):
    list_display = ['code', 'holder_name', 'record_type', 'issued_on']
    search_fields = ['code', 'holder_name']
    list_filter = ['record_type']
