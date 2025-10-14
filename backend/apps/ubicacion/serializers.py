from rest_framework import serializers
from .models import Pais, Estado, Ciudad


class PaisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pais
        fields = ['id', 'nombre']


class EstadoSerializer(serializers.ModelSerializer):
    pais = PaisSerializer(read_only=True)

    class Meta:
        model = Estado
        fields = ['id', 'nombre', 'pais']


class CiudadSerializer(serializers.ModelSerializer):
    estado = EstadoSerializer(read_only=True)

    class Meta:
        model = Ciudad
        fields = ['id', 'nombre', 'estado']
