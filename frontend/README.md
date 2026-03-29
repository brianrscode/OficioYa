# OficioYa Frontend

Aplicacion movil de OficioYa construida con Expo + React Native (Expo Router).

## Requisitos

- [Node.js](https://nodejs.org/) 20 o superior (incluye npm)
- (Opcional) Expo Go en tu celular para pruebas rapidas
- Backend de OficioYa corriendo localmente (por defecto en `http://127.0.0.1:8000`)

## 1) Clonar el repositorio

```bash
git clone https://github.com/brianrscode/OficioYa.git
```

### 1.1) Entrar al directorio

```bash
cd OficioYa/frontend
```

## 2) Instalar dependencias

```bash
npm install
```

## 3) Configurar la URL del backend

El frontend consume la API usando `API_BASE_URL` en `constants/Config.ts`.

Valor actual:

```ts
export const API_BASE_URL = "http://127.0.0.1:8000";
```

Si usas otro host/puerto o un backend remoto, actualiza esa constante.

## 4) Ejecutar la app

```bash
# Inicia Metro/Expo
npm run start
```

Comandos utiles:

```bash
# Abrir en Android
npm run android

# Abrir en iOS (solo macOS)
npm run ios

# Abrir en navegador
npm run web

# Linter
npm run lint
```

## 5) Flujo recomendado en local

1. Levanta el backend (ver `../backend/README.md`).
2. Verifica que la API responda en `http://127.0.0.1:8000/`.
3. Inicia el frontend con `npm run start`.
4. Abre en Expo Go, emulador Android/iOS o Web.

## Solucion de problemas

- Error de red o peticiones fallidas: revisa `API_BASE_URL` y que el backend este encendido.
- Cambios no reflejados: reinicia Metro con `npm run start`.
- Problemas de dependencias: elimina `node_modules` y ejecuta `npm install` de nuevo.
