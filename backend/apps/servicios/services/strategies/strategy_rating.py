from django.db.models import Avg
from .search_strategy import SearchStrategy


class StrategyRating(SearchStrategy):
    def ordenar(self, queryset):
        # Ordena por calificación promedio de reviews recibidas por el usuario
        return queryset.annotate(
            avg_calificacion=Avg('reviews_recibidas__calificacion')
        ).order_by('-avg_calificacion')
