from django.urls import path
from .views import (
    UsuarioListView,
    RegisterView,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    MeView,
    UpdateUserView
)


urlpatterns = [
    path('list/', UsuarioListView.as_view(), name='usuarios-list'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('me/', MeView.as_view(), name='me'),
    path('update/', UpdateUserView.as_view(), name='update-user'),
]
