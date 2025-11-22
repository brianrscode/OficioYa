from .search_strategy import SearchStrategy


class StrategyServicio(SearchStrategy):
    def ordenar(self, queryset):
        # Ordena por nombre de usuario
        return queryset.order_by('username')

