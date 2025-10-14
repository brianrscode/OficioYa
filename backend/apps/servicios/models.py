from django.db import models
from django.conf import settings


Usuario = settings.AUTH_USER_MODEL

class Servicio(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nombre


class PrestadorServicios(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="servicios_ofrecidos")
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE, related_name="prestadores")
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario', 'servicio')

    def __str__(self):
        return f"{self.usuario.username} - {self.servicio.nombre}"
