from .search_strategy import SearchStrategy


class StrategyCiudad(SearchStrategy):
    def ordenar(self, queryset):
        # Ordena por nombre de ciudad del usuario
        return queryset.order_by("ciudad__nombre")
