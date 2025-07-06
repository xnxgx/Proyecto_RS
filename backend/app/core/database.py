"""
Configuración de la base de datos
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import redis
from app.core.config import settings

# Configurar SQLAlchemy
engine = create_engine(
    settings.DATABASE_URL,
    poolclass=StaticPool,
    pool_pre_ping=True,
    echo=settings.DEBUG
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para modelos
Base = declarative_base()

# Configurar Redis
redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)

def get_db():
    """
    Obtiene una sesión de base de datos
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_redis():
    """
    Obtiene cliente Redis
    """
    return redis_client

# Función para verificar conexión a la base de datos
def check_database_connection():
    """
    Verifica la conexión a la base de datos
    """
    try:
        with engine.connect() as connection:
            connection.execute("SELECT 1")
        return True
    except Exception as e:
        print(f"Error conectando a la base de datos: {e}")
        return False

# Función para verificar conexión a Redis
def check_redis_connection():
    """
    Verifica la conexión a Redis
    """
    try:
        redis_client.ping()
        return True
    except Exception as e:
        print(f"Error conectando a Redis: {e}")
        return False 