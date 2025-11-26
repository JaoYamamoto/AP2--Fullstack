from flask import Blueprint, request, jsonify
from app.models import db, Anime
from app.services.anime_service import AnimeService
from functools import wraps

anime_bp = Blueprint('animes', __name__)
anime_service = AnimeService()


def handle_errors(f):
    """Decorador para tratamento de erros"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except ValueError as e:
            return {'error': str(e)}, 400
        except Exception as e:
            return {'error': 'Internal server error', 'details': str(e)}, 500
    return decorated_function


@anime_bp.route('/search', methods=['GET'])
@handle_errors
def search_animes():
    """
    Buscar animes
    ---
    tags:
      - Animes
    parameters:
      - in: query
        name: q
        type: string
        required: true
        description: Nome do anime para buscar
      - in: query
        name: limit
        type: integer
        default: 12
        description: Número máximo de resultados
    responses:
      200:
        description: Lista de animes encontrados
      400:
        description: Parâmetro de busca inválido
    """
    query = request.args.get('q', '').strip()
    limit = request.args.get('limit', 12, type=int)
    
    if not query:
        return {'error': 'Search query is required'}, 400
    
    animes = anime_service.search_animes(query, limit)
    return {'animes': [a.to_dict() for a in animes]}, 200


@anime_bp.route('', methods=['GET'])
@handle_errors
def list_animes():
    """
    Listar todos os animes
    ---
    tags:
      - Animes
    responses:
      200:
        description: Lista de animes
    """
    animes = Anime.query.all()
    return {'animes': [a.to_dict() for a in animes]}, 200


@anime_bp.route('/<int:anime_id>', methods=['GET'])
@handle_errors
def get_anime(anime_id):
    """
    Obter detalhes de um anime
    ---
    tags:
      - Animes
    parameters:
      - in: path
        name: anime_id
        type: integer
        required: true
    responses:
      200:
        description: Detalhes do anime
      404:
        description: Anime não encontrado
    """
    # Tentar buscar por mal_id primeiro (MyAnimeList ID)
    anime = anime_service.get_anime_by_mal_id(anime_id)
    
    # Se nao encontrar, tentar por id do banco
    if not anime:
        anime = anime_service.get_anime(anime_id)
    
    if not anime:
        return {'error': 'Anime not found'}, 404
    
    return {'anime': anime.to_dict()}, 200


@anime_bp.route('', methods=['POST'])
@handle_errors
def create_anime():
    """
    Criar novo anime
    ---
    tags:
      - Animes
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            mal_id:
              type: integer
            title:
              type: string
            synopsis:
              type: string
            score:
              type: number
            episodes:
              type: integer
            image_url:
              type: string
            status:
              type: string
    responses:
      201:
        description: Anime criado
      400:
        description: Dados inválidos
    """
    data = request.get_json()
    
    if not data or 'mal_id' not in data or 'title' not in data:
        return {'error': 'Missing required fields'}, 400
    
    anime = anime_service.create_anime(data)
    return {'message': 'Anime created successfully', 'anime': anime.to_dict()}, 201


@anime_bp.route('/<int:anime_id>', methods=['PUT'])
@handle_errors
def update_anime(anime_id):
    """
    Atualizar anime
    ---
    tags:
      - Animes
    parameters:
      - in: path
        name: anime_id
        type: integer
        required: true
      - in: body
        name: body
        schema:
          type: object
    responses:
      200:
        description: Anime atualizado
      404:
        description: Anime não encontrado
    """
    data = request.get_json()
    anime = anime_service.update_anime(anime_id, data)
    
    if not anime:
        return {'error': 'Anime not found'}, 404
    
    return {'message': 'Anime updated successfully', 'anime': anime.to_dict()}, 200


@anime_bp.route('/<int:anime_id>', methods=['DELETE'])
@handle_errors
def delete_anime(anime_id):
    """
    Deletar anime
    ---
    tags:
      - Animes
    parameters:
      - in: path
        name: anime_id
        type: integer
        required: true
    responses:
      200:
        description: Anime deletado
      404:
        description: Anime não encontrado
    """
    success = anime_service.delete_anime(anime_id)
    
    if not success:
        return {'error': 'Anime not found'}, 404
    
    return {'message': 'Anime deleted successfully'}, 200
