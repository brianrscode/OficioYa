from rest_framework import generics
from .models import Servicio, PrestadorServicios
from .serializers import ServicioSerializer, PrestadorServiciosSerializer


class ServicioListCreateView(generics.ListCreateAPIView):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer


class PrestadorServiciosListCreateView(generics.ListCreateAPIView):
    queryset = PrestadorServicios.objects.all()
    serializer_class = PrestadorServiciosSerializer


from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .services.search_service import SearchService
from .services.strategies.strategy_ciudad import StrategyCiudad
from .services.strategies.strategy_rating import StrategyRating

class BuscarPrestadoresView(APIView):
    def get(self, request):
        q = request.query_params.get("q", "")
        ciudad = request.query_params.get("ciudad", "")
        criterio = request.query_params.get("criterio", "rating")

        if criterio == "ciudad":
            strategy = StrategyCiudad()
        else:
            strategy = StrategyRating()

        service = SearchService(strategy)
        queryset = PrestadorServicios.objects.select_related("servicio", "usuario").all()

        if q:
            queryset = queryset.filter(
                Q(servicio__nombre__icontains=q) |
                Q(usuario__username__icontains=q)
            )
        if ciudad:
            queryset = queryset.filter(usuario__ciudad__nombre__icontains=ciudad)

        prestadores = service.buscar_prestadores(q, ciudad, queryset)

        data = [
            {
                "prestador": p.usuario.username,
                "servicio": p.servicio.nombre,
                "fecha_registro": p.fecha_registro,
                "ciudad": p.usuario.ciudad.nombre
            }
            for p in prestadores
        ]
        return Response(data)
