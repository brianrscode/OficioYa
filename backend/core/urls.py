from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # urls de usuarios
    path('api/usuarios/', include('apps.usuarios.urls')),
    path('api/ubicacion/', include('apps.ubicacion.urls')),
    path('api/servicios/', include('apps.servicios.urls')),
    path('api/publicaciones/', include('apps.publicaciones.urls')),
    path('api/reviews/', include('apps.reviews.urls')),

    # your patterns -> tus urls
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # opcional
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
