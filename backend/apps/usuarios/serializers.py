from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Usuario
from apps.servicios.models import Servicio, PrestadorServicios


Usuario = get_user_model()


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'id', 'username', 'email', 'telefono', 'nombres', 'apellido_paterno',
            'apellido_materno', 'foto', 'sexo', 'fecha_nacimiento',
            'ciudad', 'rol'
        ]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    servicios = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        write_only=True
    )

    class Meta:
        model = Usuario
        fields = [
            'username', 'email', 'telefono', 'password',
            'nombres', 'apellido_paterno', 'apellido_materno',
            'foto', 'sexo', 'fecha_nacimiento', 'ciudad', 'rol',
            'servicios'
        ]

    def create(self, validated_data):
        servicios = validated_data.pop('servicios', [])
        user = Usuario.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            telefono=validated_data.get('telefono', None),
            password=validated_data['password'],
            nombres=validated_data.get('nombres', ''),
            apellido_paterno=validated_data.get('apellido_paterno', ''),
            apellido_materno=validated_data.get('apellido_materno', ''),
            foto=validated_data.get('foto', None),
            sexo=validated_data.get('sexo', ''),
            fecha_nacimiento=validated_data.get('fecha_nacimiento', None),
            ciudad=validated_data.get('ciudad', None),
            rol=validated_data.get('rol', 'contratante')
        )

        # Si el usuario es prestador, registrar servicios
        if user.rol == 'prestador' and servicios:
            for servicio_id in servicios:
                try:
                    servicio = Servicio.objects.get(id=servicio_id)
                    PrestadorServicios.objects.create(usuario=user, servicio=servicio)
                except Servicio.DoesNotExist:
                    continue

        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Agregar datos personalizados al token
        token['username'] = user.username
        token['rol'] = user.rol
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Agregar datos al response además de access/refresh
        data['user'] = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "rol": self.user.rol
        }
        return data


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'nombres',
            'apellido_paterno',
            'apellido_materno',
            'username',
            'ciudad',
            'sexo',
            'fecha_nacimiento',
            'telefono',
            'email'
        ]

    def update(self, instance, validated_data):
        instance.nombres = validated_data.get('nombres', instance.nombres)
        instance.apellido_paterno = validated_data.get('apellido_paterno', instance.apellido_paterno)
        instance.apellido_materno = validated_data.get('apellido_materno', instance.apellido_materno)
        instance.username = validated_data.get('username', instance.username)
        instance.ciudad = validated_data.get('ciudad', instance.ciudad)
        instance.sexo = validated_data.get('sexo', instance.sexo)
        instance.fecha_nacimiento = validated_data.get('fecha_nacimiento', instance.fecha_nacimiento)
        instance.telefono = validated_data.get('telefono', instance.telefono)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance