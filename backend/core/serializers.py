from rest_framework import serializers
from .models import ContactSubmission, VerificationRecord, BlogPost


class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ['id', 'name', 'email', 'phone', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']


class VerificationRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationRecord
        fields = ['code', 'holder_name', 'record_type', 'issued_on', 'notes']


class BlogPostListSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['slug', 'title', 'excerpt', 'cover_image', 'published_at']


class BlogPostDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['slug', 'title', 'excerpt', 'content', 'cover_image', 'published_at']
