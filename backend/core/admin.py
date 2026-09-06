from django.contrib import admin
from .models import ContactSubmission, VerificationRecord, BlogPost, ServiceGroup, TeamMember, Testimonial


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


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'published', 'published_at', 'submitter_name']
    list_filter = ['published']
    search_fields = ['title', 'excerpt', 'content', 'submitter_name', 'submitter_email']
    prepopulated_fields = {'slug': ('title',)}


@admin.register(ServiceGroup)
class ServiceGroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'order']
    ordering = ['order', 'name']


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'role', 'order']
    ordering = ['order', 'name']


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['name', 'org', 'published', 'order']
    list_filter = ['published']
    ordering = ['order', 'name']
