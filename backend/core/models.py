from django.db import models


class ContactSubmission(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    handled = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} <{self.email}> — {self.created_at:%Y-%m-%d}'


class VerificationRecord(models.Model):
    RECORD_TYPES = [
        ('certificate', 'Training certificate'),
        ('internship', 'Internship completion'),
        ('project', 'Project delivery'),
    ]

    code = models.CharField(max_length=40, unique=True, db_index=True)
    holder_name = models.CharField(max_length=150)
    record_type = models.CharField(max_length=20, choices=RECORD_TYPES, default='certificate')
    issued_on = models.DateField()
    notes = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['-issued_on']

    def __str__(self):
        return f'{self.code} — {self.holder_name}'


class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    excerpt = models.CharField(max_length=300)
    content = models.TextField()
    cover_image = models.URLField(blank=True)
    published = models.BooleanField(default=True)
    published_at = models.DateTimeField()

    class Meta:
        ordering = ['-published_at']

    def __str__(self):
        return self.title
