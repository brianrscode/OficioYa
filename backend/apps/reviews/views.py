from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Review
from .serializers import ReviewSerializer


class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Review.objects.all(). order_by("-fecha")
        calificado_id = self.request.query_params.get("calificado")
        if calificado_id:
            qs = qs.filter(calificado_id=calificado_id)

        return qs
    
    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx 

class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        if self.request.user != serializer.instance.calificador:
            raise PermissionDenied("No puede editar reseñas ajenas")
        serializer.save()
    
    def perform_destroy(self, instance):
        if self.request.user != instance.calificador:
            raise PermissionDenied("No puedes eliminar una reseña ajena")
        instance.delete()