from rest_framework import generics
from .models import Publicacion
from .serializers import PublicacionSerializer
from .permissions import IsPrestadorOrReadOnly


class PublicacionListCreateView(generics.ListCreateAPIView):
    serializer_class = PublicacionSerializer
    permission_classes = [IsPrestadorOrReadOnly]

    def get_queryset(self):
        queryset = Publicacion.objects.all()
        usuario_id = self.request.query_params.get("usuario")

        if usuario_id:
            # Si el usuario solicita ver sus propias publicaciones
            if (
                self.request.user.is_authenticated
                and str(self.request.user.id) == usuario_id
            ):
                return queryset.filter(usuario_id=usuario_id)
            # Si se solicitan publicaciones de otro usuario, solo mostrar las públicas
            return queryset.filter(usuario_id=usuario_id, publico=True)

        # Si no se especifica usuario, mostrar todas las públicas (feed global)
        return queryset.filter(publico=True)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
