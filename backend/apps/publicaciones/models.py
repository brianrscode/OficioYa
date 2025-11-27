from django.db import models
from django.conf import settings
from cloudinary.models import CloudinaryField


Usuario = settings.AUTH_USER_MODEL

class Publicacion(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    foto = CloudinaryField('publicaciones')
    descripcion = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)
    publico = models.BooleanField(default=True)

    def __str__(self):
        return f"Publicación de {self.usuario.username} - {self.fecha.strftime('%Y-%m-%d')}"
