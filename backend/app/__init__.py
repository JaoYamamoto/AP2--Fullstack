from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flasgger import Swagger
import os
from dotenv import load_dotenv

from app.config import config
from app.models import db

# Carregar variáveis de ambiente
load_dotenv()

migrate = Migrate()



def create_app(config_name=None):
    """Factory function para criar a aplicação Flask"""
    
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    
    # Carregar configurações
    app.config.from_object(config.get(config_name, config['default']))
    
    # Inicializar extensões
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Configurar CORS com mais detalhes
    cors_origins = app.config['CORS_ORIGINS']
    CORS(app, 
         origins=cors_origins,
         allow_headers=['Content-Type', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         supports_credentials=True,
         max_age=3600)
    
    # Inicializar Swagger
    swagger = Swagger(app, template={
        'swagger': '3.0.0',
        'info': {
            'title': 'MyAnimeDiary API',
            'version': '1.0.0',
            'description': 'API Backend para gerenciar diário de animes',
            'contact': {
                'name': 'MyAnimeDiary Team'
            }
        },
        'servers': [
            {
                'url': 'http://localhost:5000',
                'description': 'Development Server'
            }
        ]
    })
    
    # Registrar blueprints
    from app.controllers.user_controller import user_bp
    from app.controllers.anime_controller import anime_bp
    from app.controllers.diary_controller import diary_bp
    
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(anime_bp, url_prefix='/api/animes')
    app.register_blueprint(diary_bp, url_prefix='/api/diary')
    
    # Criar tabelas
    with app.app_context():
        db.create_all()
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health():
        """Health check endpoint"""
        return {'status': 'ok', 'message': 'MyAnimeDiary API is running'}, 200
    
    return app
