from rest_framework import generics
from .models import Servicio, PrestadorServicios
from .serializers import ServicioSerializer, PrestadorServiciosSerializer


class ServicioListCreateView(generics.ListCreateAPIView):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer


class PrestadorServiciosListCreateView(generics.ListCreateAPIView):
    queryset = PrestadorServicios.objects.all()
    serializer_class = PrestadorServiciosSerializer
