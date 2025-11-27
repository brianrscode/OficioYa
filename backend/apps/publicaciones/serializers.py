from rest_framework import serializers
from .models import Publicacion


class PublicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publicacion
        fields = ['id', 'usuario', 'foto', 'descripcion', 'fecha', 'publico']
        read_only_fields = ['usuario']

    def to_representation(self, instance):
        rep = super().to_representation(instance)

        # Convertir el campo CloudinaryField a una URL simple
        if instance.foto:
            rep['foto'] = instance.foto.url
        else:
            rep['foto'] = None

        return rep
