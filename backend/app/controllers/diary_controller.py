from flask import Blueprint, request, jsonify
from app.models import db, DiaryEntry
from app.services.diary_service import DiaryService
from functools import wraps

diary_bp = Blueprint('diary', __name__)
diary_service = DiaryService()


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


@diary_bp.route('/user/<int:user_id>', methods=['GET'])
@handle_errors
def get_diary(user_id):
    """
    Obter diário completo do usuário
    ---
    tags:
      - Diary
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
      - in: query
        name: status
        type: string
        description: Filtrar por status (watching, completed, planned, dropped)
      - in: query
        name: sort_by
        type: string
        default: created_at
        description: Campo para ordenação
      - in: query
        name: order
        type: string
        default: desc
        description: Ordem (asc ou desc)
    responses:
      200:
        description: Diário do usuário
    """
    status = request.args.get('status')
    sort_by = request.args.get('sort_by', 'created_at')
    order = request.args.get('order', 'desc')
    
    entries = diary_service.get_user_diary(user_id, status, sort_by, order)
    return {'entries': [e.to_dict() for e in entries]}, 200


@diary_bp.route('/<int:entry_id>', methods=['GET'])
@handle_errors
def get_diary_entry(entry_id):
    """
    Obter um registro do diário
    ---
    tags:
      - Diary
    parameters:
      - in: path
        name: entry_id
        type: integer
        required: true
    responses:
      200:
        description: Registro do diário
      404:
        description: Registro não encontrado
    """
    entry = DiaryEntry.query.get(entry_id)
    
    if not entry:
        return {'error': 'Diary entry not found'}, 404
    
    return {'entry': entry.to_dict()}, 200


@diary_bp.route('', methods=['POST'])
@handle_errors
def add_to_diary():
    """
    Adicionar anime ao diário
    ---
    tags:
      - Diary
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            user_id:
              type: integer
            anime_id:
              type: integer
            user_score:
              type: integer
              minimum: 1
              maximum: 10
            status:
              type: string
              enum: [watching, completed, planned, dropped]
            episodes_watched:
              type: integer
            notes:
              type: string
    responses:
      201:
        description: Anime adicionado ao diário
      400:
        description: Dados inválidos
    """
    data = request.get_json()
    
    if not data or 'user_id' not in data or 'anime_id' not in data or 'user_score' not in data:
        return {'error': 'Missing required fields'}, 400
    
    entry = diary_service.add_to_diary(data['user_id'], data)
    return {'message': 'Anime added to diary', 'entry': entry.to_dict()}, 201


@diary_bp.route('/<int:entry_id>', methods=['PUT'])
@handle_errors
def update_diary_entry(entry_id):
    """
    Atualizar registro do diário
    ---
    tags:
      - Diary
    parameters:
      - in: path
        name: entry_id
        type: integer
        required: true
      - in: body
        name: body
        schema:
          type: object
          properties:
            user_score:
              type: integer
            status:
              type: string
            episodes_watched:
              type: integer
            notes:
              type: string
    responses:
      200:
        description: Registro atualizado
      404:
        description: Registro não encontrado
    """
    data = request.get_json()
    entry = DiaryEntry.query.get(entry_id)
    
    if not entry:
        return {'error': 'Diary entry not found'}, 404
    
    entry = diary_service.update_entry(entry_id, entry.user_id, data)
    
    return {'message': 'Diary entry updated', 'entry': entry.to_dict()}, 200


@diary_bp.route('/<int:entry_id>', methods=['DELETE'])
@handle_errors
def remove_from_diary(entry_id):
    """
    Remover anime do diário
    ---
    tags:
      - Diary
    parameters:
      - in: path
        name: entry_id
        type: integer
        required: true
    responses:
      200:
        description: Anime removido do diário
      404:
        description: Registro não encontrado
    """
    entry = DiaryEntry.query.get(entry_id)
    
    if not entry:
        return {'error': 'Diary entry not found'}, 404
    
    success = diary_service.remove_from_diary(entry_id, entry.user_id)
    
    if not success:
        return {'error': 'Diary entry not found'}, 404
    
    return {'message': 'Anime removed from diary'}, 200


@diary_bp.route('/stats/user/<int:user_id>', methods=['GET'])
@handle_errors
def get_diary_stats(user_id):
    """
    Obter estatísticas do diário
    ---
    tags:
      - Diary
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
    responses:
      200:
        description: Estatísticas do diário
    """
    stats = diary_service.get_stats(user_id)
    return {'stats': stats}, 200
