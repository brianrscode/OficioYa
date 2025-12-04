from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Servicio, PrestadorServicios
from .serializers import ServicioSerializer, PrestadorServiciosSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .services.search_service import SearchService
from .services.strategies.strategy_ciudad import StrategyCiudad
from .services.strategies.strategy_rating import StrategyRating

from apps.usuarios.models import Usuario

class ServicioListCreateView(generics.ListCreateAPIView):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer


class PrestadorServiciosListCreateView(generics.ListCreateAPIView):
    queryset = PrestadorServicios.objects.all()
    serializer_class = PrestadorServiciosSerializer


class BuscarPrestadoresView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        servicio_query = request.query_params.get("servicio", "")
        ciudad_query = request.query_params.get("ciudad", "")
        criterio = request.query_params.get("criterio", "rating")

        if criterio == "ciudad":
            strategy = StrategyCiudad()
        else:
            strategy = StrategyRating()

        service = SearchService(strategy)

        # Base queryset: Usuarios que son prestadores (tienen servicios ofrecidos)
        # Usamos distinct() para evitar duplicados si el filtro por servicio hace match múltiple
        queryset = Usuario.objects.filter(servicios_ofrecidos__isnull=False).distinct()
        queryset = queryset.select_related("ciudad").prefetch_related("servicios_ofrecidos__servicio")

        if servicio_query:
            queryset = queryset.filter(
                Q(servicios_ofrecidos__servicio__nombre__icontains=servicio_query) |
                Q(username__icontains=servicio_query) |
                Q(nombres__icontains=servicio_query) |
                Q(apellido_paterno__icontains=servicio_query)
            ).distinct()

        if ciudad_query:
            queryset = queryset.filter(ciudad__nombre__icontains=ciudad_query)

        prestadores = service.buscar_prestadores(servicio_query, ciudad_query, queryset)

        data = []
        for p in prestadores:
            servicios_lista = [ps.servicio.nombre for ps in p.servicios_ofrecidos.all()]
            data.append({
                "id": p.id,
                "nombres": p.nombres,
                "foto": p.foto.url if p.foto else "",
                "apellido_paterno": p.apellido_paterno,
                "apellido_materno": p.apellido_materno,
                "prestador": p.username,
                "servicios": servicios_lista,
                "fecha_registro": p.date_joined,
                "ciudad": p.ciudad.nombre if p.ciudad else ""
            })

        return Response(data)


class PrestadorDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            p = Usuario.objects.get(pk=pk)
            # Verificar que sea prestador (opcional, pero recomendado)
            if not p.servicios_ofrecidos.exists():
                 return Response({"error": "Este usuario no es un prestador de servicios"}, status=404)

            servicios_lista = [ps.servicio.nombre for ps in p.servicios_ofrecidos.all()]

            data = {
                "id": p.id,
                "nombres": p.nombres,
                "foto": p.foto.url if p.foto else "",
                "apellido_paterno": p.apellido_paterno,
                "apellido_materno": p.apellido_materno,
                "prestador": p.username,
                "servicios": servicios_lista,
                "fecha_registro": p.date_joined,
                "ciudad": p.ciudad.nombre if p.ciudad else "",
                "telefono": getattr(p, 'telefono', 'No disponible'), # Asumiendo que existe el campo, si no usar getattr
                "email": p.email
            }
            return Response(data)
        except Usuario.DoesNotExist:
            return Response({"error": "Prestador no encontrado"}, status=404)
