from django.core.management.base import BaseCommand
from django.utils import timezone

from core.models import BlogPost, ServiceGroup, Testimonial

SERVICE_GROUPS = [
    ('Managed IT services', [
        'Server monitoring & maintenance',
        'Network management & VPN setup',
        'Backup & disaster recovery',
        'Helpdesk & remote support',
    ]),
    ('Cloud & infrastructure', [
        'Cloud migration (AWS, Azure, GCP)',
        'Cloud cost optimization',
        'Virtualization & VDI',
        'CI/CD & DevOps pipelines',
    ]),
    ('Cybersecurity', [
        'Security audits & penetration testing',
        'Endpoint & network security',
        'SIEM & incident response',
        'Compliance & data protection',
    ]),
    ('Product development', [
        'Web & mobile app development',
        'UI/UX design',
        'API design & integration',
        'QA & automation testing',
    ]),
    ('Academic automation', [
        'Admission & enrollment portals',
        'Attendance management systems',
        'LMS integration',
        'Result & reporting dashboards',
    ]),
    ('Data & AI', [
        'Business intelligence dashboards',
        'Data engineering & ETL',
        'Automation & RPA',
        'AI & chatbot integration',
    ]),
]

TESTIMONIALS = [
    ('ARX Infotech transformed our infrastructure — downtime dropped and performance improved dramatically.', 'Ellen Downing', 'Wrode Co.'),
    ('Outstanding security audit and quick remediation suggestions. Highly recommended.', 'Douglas Galveston', 'Sitwell Financial'),
    ('Their team is proactive and always available. Fantastic partner.', 'Kian Graham', 'Henlow Express'),
    ('The academic automation platform cut our admissions processing time in half.', 'Priya Nair', 'Sundar College'),
    ('Clear communication and rock-solid delivery on every milestone.', 'Marcus Webb', 'Northline Retail'),
    ('Cloud migration was seamless — zero downtime, exactly as promised.', 'Aisha Rahman', 'Verdant Labs'),
]


class Command(BaseCommand):
    help = 'Seeds demo content (service groups, testimonials, a sample blog post). Idempotent — safe to re-run.'

    def handle(self, *args, **options):
        created_services = 0
        for i, (name, items) in enumerate(SERVICE_GROUPS):
            _, created = ServiceGroup.objects.get_or_create(
                name=name, defaults=dict(order=i, items='\n'.join(items)),
            )
            created_services += created

        created_testimonials = 0
        for i, (quote, name, org) in enumerate(TESTIMONIALS):
            _, created = Testimonial.objects.get_or_create(
                name=name, defaults=dict(quote=quote, org=org, order=i),
            )
            created_testimonials += created

        _, post_created = BlogPost.objects.get_or_create(
            slug='hello-world',
            defaults=dict(
                title='Hello, world',
                excerpt='First post on the ARX Infotech blog.',
                content='<p>This is a sample post seeded for testing the blog list and detail pages.</p>',
                published_at=timezone.now(),
            ),
        )

        self.stdout.write(self.style.SUCCESS(
            f'Seed complete — service groups: +{created_services} (total {ServiceGroup.objects.count()}), '
            f'testimonials: +{created_testimonials} (total {Testimonial.objects.count()}), '
            f'sample blog post: {"created" if post_created else "already existed"}.'
        ))
