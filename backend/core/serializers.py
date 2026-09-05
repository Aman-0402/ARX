from django.utils.text import slugify
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


class BlogPostAdminSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(max_length=220, required=False)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'slug', 'title', 'excerpt', 'content', 'cover_image',
            'published', 'published_at',
        ]

    def validate_slug(self, value):
        if not value:
            return value
        qs = BlogPost.objects.filter(slug=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError('A post with this slug already exists.')
        return value

    def create(self, validated_data):
        if not validated_data.get('slug'):
            base = slugify(validated_data['title'])[:220]
            slug = base
            n = 2
            while BlogPost.objects.filter(slug=slug).exists():
                suffix = f'-{n}'
                slug = f'{base[:220 - len(suffix)]}{suffix}'
                n += 1
            validated_data['slug'] = slug
        return super().create(validated_data)
