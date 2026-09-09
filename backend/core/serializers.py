from django.utils.text import slugify
from rest_framework import serializers
from .models import ContactSubmission, VerificationRecord, BlogPost, ServiceGroup, TeamMember, Testimonial


class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ['id', 'name', 'email', 'phone', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']


class ContactSubmissionAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ['id', 'name', 'email', 'phone', 'message', 'created_at', 'handled']
        read_only_fields = ['id', 'name', 'email', 'phone', 'message', 'created_at']


class VerificationRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationRecord
        fields = ['code', 'holder_name', 'record_type', 'issued_on', 'notes']


class VerificationRecordAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationRecord
        fields = ['id', 'code', 'holder_name', 'record_type', 'issued_on', 'notes']


class BlogPostListSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['slug', 'title', 'excerpt', 'cover_image', 'published_at']


class BlogPostDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['slug', 'title', 'excerpt', 'content', 'cover_image', 'published_at']


def _unique_blog_slug(title):
    base = slugify(title)[:220]
    slug = base
    n = 2
    while BlogPost.objects.filter(slug=slug).exists():
        suffix = f'-{n}'
        slug = f'{base[:220 - len(suffix)]}{suffix}'
        n += 1
    return slug


class BlogPostAdminSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(max_length=220, required=False)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'slug', 'title', 'excerpt', 'content', 'cover_image',
            'published', 'published_at', 'submitter_name', 'submitter_email',
        ]
        read_only_fields = ['submitter_name', 'submitter_email']

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
            validated_data['slug'] = _unique_blog_slug(validated_data['title'])
        return super().create(validated_data)


class BlogPostSubmitSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = [
            'title', 'excerpt', 'content', 'cover_image',
            'submitter_name', 'submitter_email',
        ]

    def create(self, validated_data):
        validated_data['slug'] = _unique_blog_slug(validated_data['title'])
        return super().create(validated_data)


class ServiceGroupPublicSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = ServiceGroup
        fields = ['name', 'image', 'items']

    def get_items(self, obj):
        return obj.items_list()


class ServiceGroupAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceGroup
        fields = ['id', 'name', 'order', 'image', 'items']


class TeamMemberPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ['name', 'role', 'bio', 'photo']


class TeamMemberAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'role', 'bio', 'photo', 'order']


class TestimonialPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['quote', 'name', 'org', 'photo']


class TestimonialAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'quote', 'name', 'org', 'photo', 'order', 'published']
