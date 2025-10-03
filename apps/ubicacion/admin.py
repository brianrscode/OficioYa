from django.contrib import admin
from .models import Pais
from .models import Estado
from .models import Ciudad


admin.site.register(Pais)
admin.site.register(Estado)
admin.site.register(Ciudad)
