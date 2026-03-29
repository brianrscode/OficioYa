from rest_framework import serializers
from .models import Servicio, PrestadorServicios


class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = ["id", "nombre"]


class PrestadorServiciosSerializer(serializers.ModelSerializer):
    servicio = ServicioSerializer(read_only=True)

    servicio_id = serializers.PrimaryKeyRelatedField(
        queryset=Servicio.objects.all(), source="servicio", write_only=True
    )

    class Meta:
        model = PrestadorServicios
        fields = ["id", "usuario", "servicio", "servicio_id", "fecha_registro"]
