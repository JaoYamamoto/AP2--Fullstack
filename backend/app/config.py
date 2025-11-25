import os
from datetime import timedelta

class Config:
    """Configuração base da aplicação"""
    
    # Flask
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///anime_diary.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS', False)
    

    
    # CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(',')
    
    # API
    API_PORT = int(os.getenv('API_PORT', 5000))
    API_HOST = os.getenv('API_HOST', '0.0.0.0')
    
    # Jikan API
    JIKAN_API_URL = os.getenv('JIKAN_API_URL', 'https://api.jikan.moe/v4')
    JIKAN_API_TIMEOUT = int(os.getenv('JIKAN_API_TIMEOUT', 10))


class DevelopmentConfig(Config):
    """Configuração para desenvolvimento"""
    DEBUG = True
    TESTING = False


class ProductionConfig(Config):
    """Configuração para produção"""
    DEBUG = False
    TESTING = False
    
    # Forçar HTTPS em produção
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'


class TestingConfig(Config):
    """Configuração para testes"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=5)


# Selecionar configuração baseada no ambiente
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
