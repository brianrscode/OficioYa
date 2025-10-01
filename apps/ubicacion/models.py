from django.db import models


class Pais(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nombre


class Estado(models.Model):
    nombre = models.CharField(max_length=100)
    pais = models.ForeignKey(Pais, on_delete=models.CASCADE, related_name="estados")

    class Meta:
        unique_together = ('nombre', 'pais')

    def __str__(self):
        return f"{self.nombre}, {self.pais.nombre}"


class Ciudad(models.Model):
    nombre = models.CharField(max_length=100)
    estado = models.ForeignKey(Estado, on_delete=models.CASCADE, related_name="ciudades")

    class Meta:
        unique_together = ('nombre', 'estado')

    def __str__(self):
        return f"{self.nombre}, {self.estado.nombre}"
