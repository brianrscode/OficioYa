from abc import ABC, abstractmethod


class SearchStrategy(ABC):
    @abstractmethod
    def ordenar(self, lista):
        """Ordena la lista de prestadores según la estrategia."""
        pass

