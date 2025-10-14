from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'calificacion', 'descripcion', 'fecha', 'calificador', 'calificado']
