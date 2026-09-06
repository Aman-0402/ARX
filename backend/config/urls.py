from django.conf import settings
from django.contrib import admin
from django.http import HttpResponse, HttpResponseNotFound
from django.urls import path, include, re_path
from django.views.static import serve


def spa_view(request, path=''):
    """Serves the built React app's index.html for any non-API route.

    Lets React Router handle client-side routes (/about, /services, ...)
    while Django still owns /api/, /admin/, /assets/ (whitenoise), and
    /media/ above this catch-all.
    """
    index_path = settings.FRONTEND_DIST / 'index.html'
    if not index_path.exists():
        return HttpResponseNotFound(
            "frontend/dist/index.html not found — run `npm run build` in frontend/ first."
        )
    return HttpResponse(index_path.read_text(encoding='utf-8'), content_type='text/html')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    path('media/<path:path>', serve, {'document_root': settings.MEDIA_ROOT}),
    re_path(r'^(?!api/|admin/|media/|assets/).*$', spa_view),
]
