from django.db.models.signals import post_migrate
from django.dispatch import receiver

from .models import Servicio


OFICIOS_INICIALES = [
    "Albañil",
    "Plomero",
    "Electricista",
    "Carpintero",
    "Cerrajero",
    "Jardinero",
    "Pintor",
    "Herrero",
    "Mecánico automotriz",
    "Mecánico de motos",
    "Técnico en refrigeración",
    "Técnico en aire acondicionado",
    "Técnico en línea blanca",
    "Técnico en computación",
    "Técnico en celulares",
    "Instalador de paneles solares",
    "Soldador",
    "Tablaroquero",
    "Yesero",
    "Azulejero",
    "Impermeabilizador",
    "Vidriero",
    "Aluminero",
    "Tapicero",
    "Costurera",
    "Sastre",
    "Zapatero",
    "Hojalatero",
    "Lavador de autos",
    "Detailer automotriz",
    "Chofer particular",
    "Cocinera",
    "Panadero",
    "Repostero",
    "Estilista",
    "Barbero",
    "Manicurista",
    "Masajista",
    "Cuidador de adultos mayores",
    "Niñera",
    "Amo de casa",
    "Ama de casa",
    "Personal de limpieza",
    "Fumigador",
    "Gasero",
    "Rotulista",
    "Fotógrafo",
    "Camarógrafo",
    "Músico",
]


@receiver(post_migrate)
def cargar_servicios_iniciales(sender, **kwargs):
    if sender.name != "apps.servicios":
        return

    for nombre in OFICIOS_INICIALES:
        Servicio.objects.get_or_create(nombre=nombre)
