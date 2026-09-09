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
    content = models.TextField(help_text='Rich text (HTML) from the writer UI.')
    cover_image = models.ImageField(upload_to='blog/', blank=True, null=True)
    published = models.BooleanField(default=True, help_text='Off = draft / pending review, not shown publicly.')
    published_at = models.DateTimeField()
    submitter_name = models.CharField(max_length=150, blank=True)
    submitter_email = models.EmailField(blank=True)

    class Meta:
        ordering = ['-published_at']

    def __str__(self):
        return self.title


class ServiceGroup(models.Model):
    name = models.CharField(max_length=150)
    order = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='services/', blank=True, null=True)
    items = models.TextField(
        blank=True,
        help_text='One item per line.',
    )

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

    def items_list(self):
        return [line.strip() for line in self.items.splitlines() if line.strip()]


class TeamMember(models.Model):
    name = models.CharField(max_length=150)
    role = models.CharField(max_length=150)
    bio = models.CharField(max_length=300, blank=True)
    photo = models.ImageField(upload_to='team/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return f'{self.name} — {self.role}'


class Client(models.Model):
    name = models.CharField(max_length=150)
    logo = models.ImageField(upload_to='clients/')
    website = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)
    published = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class Testimonial(models.Model):
    quote = models.TextField()
    name = models.CharField(max_length=150)
    org = models.CharField(max_length=150, blank=True)
    photo = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    published = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return f'{self.name} — {self.org}'


class Industry(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text='Optional emoji or short label.')
    order = models.PositiveIntegerField(default=0)
    published = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = 'industries'

    def __str__(self):
        return self.name


class CaseStudy(models.Model):
    title = models.CharField(max_length=200)
    client_name = models.CharField(max_length=150, blank=True)
    summary = models.TextField()
    result = models.CharField(max_length=200, blank=True, help_text='e.g. "40% faster reporting"')
    image = models.ImageField(upload_to='case-studies/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    published = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'title']
        verbose_name_plural = 'case studies'

    def __str__(self):
        return self.title


class TechStackItem(models.Model):
    name = models.CharField(max_length=150)
    logo = models.ImageField(upload_to='tech-stack/')
    order = models.PositiveIntegerField(default=0)
    published = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = 'tech stack items'

    def __str__(self):
        return self.name


class ProcessStep(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    published = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'title']

    def __str__(self):
        return self.title


class FAQ(models.Model):
    question = models.CharField(max_length=250)
    answer = models.TextField()
    order = models.PositiveIntegerField(default=0)
    published = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'question']
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'

    def __str__(self):
        return self.question
