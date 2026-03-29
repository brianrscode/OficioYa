from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Pais, Estado, Ciudad


@receiver(post_migrate)
def cargar_datos_iniciales(sender, **kwargs):
    if sender.name != "apps.ubicacion":
        return

    paises = [
        {"nombre": "México"},
    ]
    for pais in paises:
        Pais.objects.get_or_create(**pais)

    pais_mexico = Pais.objects.get(nombre="México")

    estados = [
        {"nombre": "Aguascalientes", "pais": pais_mexico},
        {"nombre": "Baja California", "pais": pais_mexico},
        {
            "nombre": "Baja California Sur",
            "pais": pais_mexico,
        },
        {"nombre": "Campeche", "pais": pais_mexico},
        {"nombre": "Chiapas", "pais": pais_mexico},
        {"nombre": "Chihuahua", "pais": pais_mexico},
        {"nombre": "Ciudad de México", "pais": pais_mexico},
        {"nombre": "Coahuila", "pais": pais_mexico},
        {"nombre": "Colima", "pais": pais_mexico},
        {"nombre": "Durango", "pais": pais_mexico},
        {"nombre": "Estado de México", "pais": pais_mexico},
        {"nombre": "Guanajuato", "pais": pais_mexico},
        {"nombre": "Guerrero", "pais": pais_mexico},
        {"nombre": "Hidalgo", "pais": pais_mexico},
        {"nombre": "Jalisco", "pais": pais_mexico},
        {"nombre": "Michoacán", "pais": pais_mexico},
        {"nombre": "Morelos", "pais": pais_mexico},
        {"nombre": "Nayarit", "pais": pais_mexico},
        {"nombre": "Nuevo León", "pais": pais_mexico},
        {"nombre": "Oaxaca", "pais": pais_mexico},
        {"nombre": "Puebla", "pais": pais_mexico},
        {"nombre": "Querétaro", "pais": pais_mexico},
        {"nombre": "Quintana Roo", "pais": pais_mexico},
        {"nombre": "San Luis Potosí", "pais": pais_mexico},
        {"nombre": "Sinaloa", "pais": pais_mexico},
        {"nombre": "Sonora", "pais": pais_mexico},
        {"nombre": "Tabasco", "pais": pais_mexico},
        {"nombre": "Tamaulipas", "pais": pais_mexico},
        {"nombre": "Tlaxcala", "pais": pais_mexico},
        {"nombre": "Veracruz", "pais": pais_mexico},
        {"nombre": "Yucatán", "pais": pais_mexico},
        {"nombre": "Zacatecas", "pais": pais_mexico},
    ]
    for estado in estados:
        Estado.objects.get_or_create(**estado)

    ciudades = [
        {
            "nombre": "Ciudad de México",
            "estado": Estado.objects.get(nombre="Ciudad de México"),
        },
        {"nombre": "Guadalajara", "estado": Estado.objects.get(nombre="Jalisco")},
        {"nombre": "Atlixco", "estado": Estado.objects.get(nombre="Puebla")},
        {"nombre": "Cholula", "estado": Estado.objects.get(nombre="Puebla")},
        {"nombre": "Tehuacán", "estado": Estado.objects.get(nombre="Puebla")},
        {
            "nombre": "San Pedro Cholula",
            "estado": Estado.objects.get(nombre="Puebla"),
        },
        {
            "nombre": "San Andrés Cholula",
            "estado": Estado.objects.get(nombre="Puebla"),
        },
        {
            "nombre": "San Martín Texmelucan",
            "estado": Estado.objects.get(nombre="Puebla"),
        },
        {"nombre": "Teziutlán", "estado": Estado.objects.get(nombre="Puebla")},
        {"nombre": "Huauchinango", "estado": Estado.objects.get(nombre="Puebla")},
        {"nombre": "Zacatlán", "estado": Estado.objects.get(nombre="Puebla")},
        {"nombre": "Amozoc", "estado": Estado.objects.get(nombre="Puebla")},
        {"nombre": "Cuautlancingo", "estado": Estado.objects.get(nombre="Puebla")},
        {"nombre": "Coronango", "estado": Estado.objects.get(nombre="Puebla")},
    ]
    for ciudad in ciudades:
        Ciudad.objects.get_or_create(**ciudad)
