from django.conf import settings
from django.contrib import admin
from django.http import HttpResponse, HttpResponseNotFound
from django.urls import path, include, re_path
from django.views.static import serve

from core.models import BlogPost, CaseStudy

STATIC_ROUTES = [
    '', 'about', 'services', 'blog', 'contact',
    'industries', 'case-studies', 'technology', 'process', 'faq',
    'terms', 'privacy',
]


def robots_view(request):
    body = f"User-agent: *\nAllow: /\nDisallow: /django-admin/\nSitemap: {settings.SITE_URL}/sitemap.xml\n"
    return HttpResponse(body, content_type='text/plain')


def sitemap_view(request):
    urls = [f'{settings.SITE_URL}/{route}' for route in STATIC_ROUTES]
    urls += [
        f'{settings.SITE_URL}/blog/{slug}'
        for slug in BlogPost.objects.filter(published=True).values_list('slug', flat=True)
    ]
    urls += [
        f'{settings.SITE_URL}/case-studies/{slug}'
        for slug in CaseStudy.objects.filter(published=True).values_list('slug', flat=True)
    ]
    body = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    body += [f'<url><loc>{url}</loc></url>' for url in urls]
    body.append('</urlset>')
    return HttpResponse('\n'.join(body), content_type='application/xml')


def spa_view(request, path=''):
    """Serves the built React app for any non-API route.

    First tries `path` as a literal static file under frontend/dist/ — this
    is what makes files dropped in frontend/public/ (favicon.svg, and
    anything else added there later) reachable at their root URL, since
    they're outside /api/, /admin/, /assets/, /media/ and would otherwise
    be swallowed by this catch-all and get index.html's HTML instead of
    the actual file. Falls back to index.html so React Router can handle
    client-side routes (/about, /services, ...).
    """
    if path:
        candidate = settings.FRONTEND_DIST / path
        if candidate.is_file():
            return serve(request, path, document_root=settings.FRONTEND_DIST)

    index_path = settings.FRONTEND_DIST / 'index.html'
    if not index_path.exists():
        return HttpResponseNotFound(
            "frontend/dist/index.html not found — run `npm run build` in frontend/ first."
        )
    return HttpResponse(index_path.read_text(encoding='utf-8'), content_type='text/html')


urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('api/', include('core.urls')),
    path('media/<path:path>', serve, {'document_root': settings.MEDIA_ROOT}),
    path('robots.txt', robots_view),
    path('sitemap.xml', sitemap_view),
    re_path(r'^(?!api/|django-admin/|media/|assets/)(?P<path>.*)$', spa_view),
]
