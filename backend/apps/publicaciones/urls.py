from django.urls import path
from .views import PublicacionListCreateView


urlpatterns = [
    path('', PublicacionListCreateView.as_view(), name='publicaciones-list-create'),
]
