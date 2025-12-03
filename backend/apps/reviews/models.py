from django.db import models
from django.conf import settings


Usuario = settings.AUTH_USER_MODEL

class Review(models.Model):
    calificacion = models.IntegerField()
    descripcion = models.TextField(blank=True, null=True)
    fecha = models.DateTimeField(auto_now_add=True)
    calificador = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="reviews_realizadas")
    calificado = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="reviews_recibidas")

    def __str__(self):
        return f"Review de {self.calificador.username} a {self.calificado.username} ({self.calificacion})"