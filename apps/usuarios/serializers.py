from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Usuario


Usuario = get_user_model()


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'id', 'username', 'email', 'nombres', 'apellido_paterno',
            'apellido_materno', 'foto', 'sexo', 'fecha_nacimiento',
            'ciudad', 'rol'
        ]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Usuario
        fields = ['username', 'email', 'password', 'nombres', 'apellido_paterno',
                  'apellido_materno', 'foto', 'sexo', 'fecha_nacimiento',
                  'ciudad', 'rol']

    def create(self, validated_data):
        user = Usuario.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            nombres=validated_data.get('nombres', ''),
            apellido_paterno=validated_data.get('apellido_paterno', ''),
            apellido_materno=validated_data.get('apellido_materno', ''),
            foto=validated_data.get('foto', None),
            sexo=validated_data.get('sexo', ''),
            fecha_nacimiento=validated_data.get('fecha_nacimiento', None),
            ciudad=validated_data.get('ciudad', ''),
            rol=validated_data.get('rol', 'contratante')  # valor por defecto
        )
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
