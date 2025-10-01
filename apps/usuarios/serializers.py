from rest_framework import serializers
from .models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'id', 'username', 'email', 'nombres', 'apellido_paterno',
            'apellido_materno', 'foto', 'sexo', 'fecha_nacimiento',
            'ciudad', 'rol'
        ]
