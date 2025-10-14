from rest_framework import generics
from .models import Publicacion
from .serializers import PublicacionSerializer


class PublicacionListCreateView(generics.ListCreateAPIView):
    queryset = Publicacion.objects.all()
    serializer_class = PublicacionSerializer
