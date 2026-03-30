from django.db import models
from django.conf import settings


Usuario = settings.AUTH_USER_MODEL


class Review(models.Model):
    calificacion = models.IntegerField()
    descripcion = models.TextField(blank=True, null=True)
    fecha = models.DateTimeField(auto_now_add=True)
    calificador = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name="reviews_realizadas"
    )
    calificado = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name="reviews_recibidas"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["calificador", "calificado"],
                name="unique_review_calificador_calificado",
            ),
            models.CheckConstraint(
                check=models.Q(calificacion__gte=1) & models.Q(calificacion__lte=5),
                name="review_calificacion_entre_1_y_5",
            ),
        ]

    def __str__(self):
        return f"Review de {self.calificador.username} a {self.calificado.username} ({self.calificacion})"
