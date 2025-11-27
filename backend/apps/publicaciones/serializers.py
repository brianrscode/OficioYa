from rest_framework import serializers
from .models import Publicacion


class PublicacionSerializer(serializers.ModelSerializer):
    foto = serializers.SerializerMethodField()

    class Meta:
        model = Publicacion
        fields = ['id', 'usuario', 'foto', 'descripcion', 'fecha', 'publico']
        read_only_fields = ['usuario']

    def get_foto(self, obj):
        """Return the full Cloudinary URL for the foto field"""
        if obj.foto:
            return obj.foto.url
        return None

