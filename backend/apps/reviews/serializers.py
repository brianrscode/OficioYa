from rest_framework import serializers
from .models import Review
from apps.usuarios.models import Usuario


class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ["id", "username", "foto"]


class ReviewSerializer(serializers.ModelSerializer):
    calificador_data = UserMiniSerializer(source="calificador", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "calificacion",
            "descripcion",
            "fecha",
            "calificador",
            "calificado",
            "calificador_data",
        ]
        read_only_fields = ["calificador", "fecha"]

    def validate_calificacion(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("La calificación esta fuera de rango")
        return value

    def validate(self, attrs):
        request = self.context["request"]
        calificado = attrs.get("calificado")

        if calificado and request.user == calificado:
            raise serializers.ValidationError("No puedes calificarte a ti mismo")

        attrs["calificador"] = request.user
        return attrs

    def create(self, validated_data):
        review, created = Review.objects.update_or_create(
            calificador=validated_data["calificador"],
            calificado=validated_data["calificado"],
            defaults={
                "calificacion": validated_data["calificacion"],
                "descripcion": validated_data.get("descripcion", ""),
            },
        )
        return review
