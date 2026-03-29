from django.urls import path
from .views import PaisListCreateView, EstadoListCreateView, CiudadListCreateView


urlpatterns = [
    path("paises/", PaisListCreateView.as_view(), name="paises-list-create"),
    path("estados/", EstadoListCreateView.as_view(), name="estados-list-create"),
    path("ciudades/", CiudadListCreateView.as_view(), name="ciudades-list-create"),
]
