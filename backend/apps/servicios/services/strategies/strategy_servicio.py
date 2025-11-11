from .search_strategy import SearchStrategy


class StrategyServicio(SearchStrategy):
    def ordenar(self, queryset):
        # Ordena por calificación promedio de reviews recibidas por el usuario prestador
        return queryset.order_by('-prestador')

