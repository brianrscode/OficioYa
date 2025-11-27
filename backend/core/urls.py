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
]

# Solo incluir documentación de API en modo DEBUG (desarrollo)
if settings.DEBUG:
    urlpatterns += [
        path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
        path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
        path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    ]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)