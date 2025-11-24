from django.urls import path
from .views import ServicioListCreateView, PrestadorServiciosListCreateView, BuscarPrestadoresView, PrestadorDetailView


urlpatterns = [
    path('servicios/', ServicioListCreateView.as_view(), name='servicios-list-create'),
    path('prestadores/', PrestadorServiciosListCreateView.as_view(), name='prestadores-servicios-list-create'),
    path('buscar/', BuscarPrestadoresView.as_view(), name='buscar'),
    path('prestadores/<int:pk>/', PrestadorDetailView.as_view(), name='prestador-detail'),
]
