from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField

from apps.ubicacion.models import Ciudad


class Usuario(AbstractUser):
    # Campos extra
    nombres = models.CharField(max_length=20)
    apellido_paterno = models.CharField(max_length=20)
    apellido_materno = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=10, blank=True, null=True)
    foto = CloudinaryField("usuarios/fotos/", blank=True, null=True)
    sexo = models.CharField(max_length=10, blank=True, null=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    ciudad = models.ForeignKey(Ciudad, on_delete=models.SET_NULL, null=True, blank=True)
    rol = models.CharField(
        max_length=20,
        choices=[("contratante", "Contratante"), ("prestador", "Prestador")],
        default="contratante",
    )

    def __str__(self):
        return f"{self.username} ({self.rol})"
