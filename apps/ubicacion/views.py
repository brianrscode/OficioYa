from rest_framework import generics
from .models import Pais, Estado, Ciudad
from .serializers import PaisSerializer, EstadoSerializer, CiudadSerializer


class PaisListCreateView(generics.ListCreateAPIView):
    queryset = Pais.objects.all()
    serializer_class = PaisSerializer


class EstadoListCreateView(generics.ListCreateAPIView):
    queryset = Estado.objects.all()
    serializer_class = EstadoSerializer


class CiudadListCreateView(generics.ListCreateAPIView):
    queryset = Ciudad.objects.all()
    serializer_class = CiudadSerializer
