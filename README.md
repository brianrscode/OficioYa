# OficioYa

<div align="center">
    <img src="frontend/assets/images/Logo_OficioYa.png" alt="Logo" width="200">
</div>

## Instalación

### 1. Clonar el repositorio:
```bash
git clone https://github.com/brianrscode/OficioYa.git
```

### 2. Instalar dependencias:

#### 2.1 Backend Django RESET Framework:

2.1.1 Acceder al directorio backend:
```bash
cd OficioYa/backend
```

2.1.2 Crea un entorno virtual
```bash
python -m venv venv
```

2.1.3 Activa el entorno virtual
    - En Windows:

    ```bash
    venv\Scripts\activate
    ```

    - En macOS y Linux:

    ```bash
    source venv/bin/activate
    ```

2.1.4 Instala las dependencias:
```bash
pip install -r requirements.txt
```

2.1.5 Agrega tú archivo .env que contenga las variables de entorno de tu proyecto:
```bash
SECRET_KEY=tu_clave
DEBUG=True
NAME_BD=nombre_bd
USER_BD=usuario_bd
PASSWORD_BD=contraseña
HOST_BD=localhost
PORT_BD=1234
TIME_ZONE=America/Mexico_City
```

2.1.6 Inicia tu gestor de base de datos y crea la base.

2.1.7 Aplica las migraciones:
```bash
python manage.py makemigrations
```
```bash
python manage.py migrate
```

### 2.2 Frontend React Native:

2.2.1 Acceder al directorio frontend:
```bash
cd OficioYa/frontend
```

2.2.2 Instalar dependencias:
```bash
npm install
```

## Ejecución

### 1. Backend:
```bash
python manage.py runserver
```

### 2. Frontend:
```bash
npm run start
```