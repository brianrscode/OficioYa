from rest_framework import generics, permissions
from .models import Pais, Estado, Ciudad
from .serializers import PaisSerializer, EstadoSerializer, CiudadSerializer


class PaisListCreateView(generics.ListAPIView):
    queryset = Pais.objects.all()
    serializer_class = PaisSerializer
    permission_classes = [permissions.AllowAny]


class EstadoListCreateView(generics.ListAPIView):
    queryset = Estado.objects.all()
    serializer_class = EstadoSerializer
    permission_classes = [permissions.AllowAny]


class CiudadListCreateView(generics.ListAPIView):
    queryset = Ciudad.objects.all()
    serializer_class = CiudadSerializer
    permission_classes = [permissions.AllowAny]
