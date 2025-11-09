from .search_strategy import SearchStrategy


class StrategyCiudad(SearchStrategy):
    def ordenar(self, queryset):
        # Ordena por nombre de ciudad del usuario asociado
        return queryset.order_by('usuario__ciudad__nombre')
