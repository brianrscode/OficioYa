from rest_framework import permissions

class IsPrestadorOrReadOnly(permissions.BasePermission):
    """
    Permite lectura a cualquiera, pero creación solo a usuarios con rol 'prestador'.
    """
    def has_permission(self, request, view):
        # Permitir métodos de lectura (GET, HEAD, OPTIONS) a cualquiera
        if request.method in permissions.SAFE_METHODS:
            return True

        # Para escritura (POST), el usuario debe estar autenticado y ser prestador
        return (
            request.user and
            request.user.is_authenticated and
            getattr(request.user, 'rol', None) == 'prestador'
        )
