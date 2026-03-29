from .strategies.strategy_rating import StrategyRating


class SearchService:
    def __init__(self, strategy=None):
        self._strategy = strategy or StrategyRating()  # estrategia por defecto

    def set_strategy(self, strategy):
        self._strategy = strategy

    def buscar_prestadores(self, q, ciudad, queryset):
        # El queryset ya viene filtrado desde la view; aquí solo aplicamos la estrategia de ordenación
        return self._strategy.ordenar(queryset)
