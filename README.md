# OficioYa

<div align="center">
    <img src="frontend/assets/images/Logo_OficioYa.png" alt="Logo" width="200">
</div>

Repositorio monorepo de OficioYa con backend en Django/DRF y frontend en Expo/React Native.

## Estructura del proyecto

- `backend/`: API REST, base de datos y servicios del servidor.
- `frontend/`: app movil con Expo Router.

## Documentacion por proyecto

- Backend: `./backend/README.md`
- Frontend: `./frontend/README.md`

## Inicio rapido

### 1) Clonar el repositorio

```bash
git clone https://github.com/brianrscode/OficioYa.git
```

### 2) Levantar backend

Sigue la guia completa en `./backend/README.md`.

### 3) Levantar frontend

Sigue la guia completa en `./frontend/README.md`.

## Orden recomendado de arranque

1. Levanta el backend.
2. Verifica que la API responda en `http://127.0.0.1:8000/`.
3. Levanta el frontend.

De esta forma, la app movil puede consumir la API desde el inicio.
