"""
Aplicación principal de la Red Social
Backend con FastAPI
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import structlog
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.api import api_router
from app.core.logging import setup_logging

# Configurar logging
setup_logging()
logger = structlog.get_logger()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Eventos de inicio y cierre de la aplicación
    """
    # Startup
    logger.info("🚀 Iniciando Red Social Backend...")
    
    # Crear tablas de base de datos
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Base de datos inicializada")
    except Exception as e:
        logger.error(f"❌ Error al inicializar base de datos: {e}")
    
    yield
    
    # Shutdown
    logger.info("🛑 Cerrando Red Social Backend...")

def create_app() -> FastAPI:
    """
    Crea y configura la aplicación FastAPI
    """
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description="API de la Red Social - Una plataforma moderna para conectar personas",
        version="1.0.0",
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
        openapi_url="/openapi.json" if settings.DEBUG else None,
        lifespan=lifespan
    )

    # Configurar CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_HOSTS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Configurar Trusted Hosts
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS
    )

    # Incluir rutas de la API
    app.include_router(api_router, prefix="/api/v1")

    @app.get("/")
    async def root():
        """
        Endpoint raíz de la API
        """
        return {
            "message": "Bienvenido a la API de Red Social",
            "version": "1.0.0",
            "status": "running",
            "docs": "/docs" if settings.DEBUG else None
        }

    @app.get("/health")
    async def health_check():
        """
        Endpoint de verificación de salud
        """
        return {
            "status": "healthy",
            "timestamp": "2025-07-06T12:00:00Z"
        }

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        """
        Manejador global de excepciones
        """
        logger.error(f"Error no manejado: {exc}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "detail": "Error interno del servidor",
                "type": "internal_server_error"
            }
        )

    return app

# Crear instancia de la aplicación
app = create_app()

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info" if settings.DEBUG else "warning"
    ) 