# Guía de Instalación - Red Social

## 📋 Prerrequisitos

### Software Requerido
- **Node.js** 18+ (para frontend)
- **Python** 3.9+ (para backend)
- **PostgreSQL** 15+ (base de datos)
- **Redis** 7+ (cache)
- **Git** (control de versiones)
- **Docker** (opcional, para desarrollo con contenedores)

### Verificar Instalaciones
```bash
# Verificar Node.js
node --version
npm --version

# Verificar Python
python --version
pip --version

# Verificar PostgreSQL
psql --version

# Verificar Redis
redis-server --version

# Verificar Docker (opcional)
docker --version
docker-compose --version
```

## 🚀 Instalación Rápida con Docker

### Opción 1: Desarrollo con Docker Compose
```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd red_social

# Iniciar todos los servicios
docker-compose up -d

# Verificar que todo esté funcionando
docker-compose ps
```

### Opción 2: Desarrollo Local

#### 1. Configurar Base de Datos
```bash
# Crear base de datos PostgreSQL
createdb red_social

# O usar Docker solo para base de datos
docker run -d \
  --name red_social_postgres \
  -e POSTGRES_DB=red_social \
  -e POSTGRES_USER=red_social_user \
  -e POSTGRES_PASSWORD=red_social_password \
  -p 5432:5432 \
  postgres:15-alpine

# Iniciar Redis
docker run -d \
  --name red_social_redis \
  -p 6379:6379 \
  redis:7-alpine
```

#### 2. Configurar Backend
```bash
# Navegar al directorio backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Copiar archivo de configuración
cp env.example .env

# Editar variables de entorno
# (Ajustar DATABASE_URL, SECRET_KEY, etc.)

# Ejecutar migraciones
alembic upgrade head

# Iniciar servidor de desarrollo
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### 3. Configurar Frontend
```bash
# Navegar al directorio frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## ⚙️ Configuración Detallada

### Variables de Entorno

#### Backend (.env)
```env
# Configuración de la aplicación
DEBUG=True
PROJECT_NAME="Red Social API"
VERSION="1.0.0"

# Servidor
HOST="0.0.0.0"
PORT=8000

# Base de datos
DATABASE_URL="postgresql://red_social_user:red_social_password@localhost/red_social"
REDIS_URL="redis://localhost:6379"

# Seguridad
SECRET_KEY="your-super-secret-key-change-in-production"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_HOSTS=["http://localhost:3000", "http://127.0.0.1:3000"]
```

#### Frontend (.env)
```env
# API URL
VITE_API_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws

# Configuración de la aplicación
VITE_APP_NAME="Red Social"
VITE_APP_VERSION="1.0.0"
```

### Configuración de Base de Datos

#### PostgreSQL
```sql
-- Crear usuario y base de datos
CREATE USER red_social_user WITH PASSWORD 'red_social_password';
CREATE DATABASE red_social OWNER red_social_user;
GRANT ALL PRIVILEGES ON DATABASE red_social TO red_social_user;
```

#### Redis
```bash
# Configuración básica de Redis
redis-server --port 6379 --daemonize yes
```

## 🔧 Scripts de Desarrollo

### Backend
```bash
# Instalar dependencias
pip install -r requirements.txt

# Ejecutar tests
pytest

# Formatear código
black .

# Linting
flake8 .

# Type checking
mypy .

# Ejecutar servidor de desarrollo
uvicorn main:app --reload
```

### Frontend
```bash
# Instalar dependencias
npm install

# Ejecutar tests
npm test

# Linting
npm run lint

# Formatear código
npm run format

# Ejecutar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

## 🐳 Docker

### Construir Imágenes
```bash
# Backend
docker build -t red-social-backend ./backend

# Frontend
docker build -t red-social-frontend ./frontend
```

### Ejecutar con Docker Compose
```bash
# Desarrollo
docker-compose up -d

# Producción
docker-compose --profile production up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## 📊 Verificar Instalación

### Backend
```bash
# Verificar API
curl http://localhost:8000/

# Verificar documentación
# Abrir en navegador: http://localhost:8000/docs
```

### Frontend
```bash
# Verificar aplicación
# Abrir en navegador: http://localhost:3000
```

### Base de Datos
```bash
# Verificar PostgreSQL
psql -h localhost -U red_social_user -d red_social -c "SELECT version();"

# Verificar Redis
redis-cli ping
```

## 🚨 Solución de Problemas

### Error de Conexión a Base de Datos
```bash
# Verificar que PostgreSQL esté ejecutándose
sudo systemctl status postgresql

# Verificar conexión
psql -h localhost -U red_social_user -d red_social
```

### Error de Conexión a Redis
```bash
# Verificar que Redis esté ejecutándose
redis-cli ping

# Reiniciar Redis
sudo systemctl restart redis
```

### Error de Dependencias Python
```bash
# Recrear entorno virtual
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Error de Dependencias Node.js
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📝 Próximos Pasos

1. **Configurar autenticación**: Implementar registro y login
2. **Crear modelos de base de datos**: Usuarios, posts, comentarios
3. **Implementar API endpoints**: CRUD básico
4. **Crear componentes frontend**: Páginas principales
5. **Configurar WebSockets**: Mensajería en tiempo real
6. **Implementar subida de archivos**: Imágenes y videos
7. **Configurar testing**: Tests unitarios y de integración

## 🔗 Enlaces Útiles

- **Documentación FastAPI**: https://fastapi.tiangolo.com/
- **Documentación Vite**: https://vitejs.dev/
- **Documentación Tailwind CSS**: https://tailwindcss.com/
- **Documentación PostgreSQL**: https://www.postgresql.org/docs/
- **Documentación Redis**: https://redis.io/documentation 