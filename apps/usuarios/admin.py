from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario


class UsuarioAdmin(UserAdmin):
    model = Usuario

    # Campos a mostrar en la lista
    list_display = ['username', 'email', 'nombres', 'apellido_paterno', 'rol', 'is_staff']

    # Campos para el formulario de edición
    fieldsets = UserAdmin.fieldsets + (
        ('Información Personal', {
            'fields': ('nombres', 'apellido_paterno', 'apellido_materno', 'foto', 'sexo', 'fecha_nacimiento', 'ciudad', 'rol')
        }),
    )

    # Campos para el formulario de creación
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Información Personal', {
            'fields': ('nombres', 'apellido_paterno', 'apellido_materno', 'foto', 'sexo', 'fecha_nacimiento', 'ciudad', 'rol')
        }),
    )


admin.site.register(Usuario, UsuarioAdmin)