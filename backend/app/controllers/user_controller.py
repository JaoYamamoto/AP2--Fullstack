from flask import Blueprint, request, jsonify
from app.models import db, User
from app.services.user_service import UserService
from functools import wraps

user_bp = Blueprint('users', __name__)
user_service = UserService()


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


@user_bp.route('/register', methods=['POST'])
@handle_errors
def register():
    """
    Registrar novo usuário
    ---
    tags:
      - Users
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            username:
              type: string
              example: "john_doe"
            email:
              type: string
              example: "john@example.com"
            password:
              type: string
              example: "password123"
    responses:
      201:
        description: Usuário criado com sucesso
      400:
        description: Dados inválidos
    """
    data = request.get_json()
    
    if not data or not all(k in data for k in ['username', 'email', 'password']):
        return {'error': 'Missing required fields'}, 400
    
    user = user_service.create_user(
        username=data['username'],
        email=data['email'],
        password=data['password']
    )
    
    return {'message': 'User created successfully', 'user': user.to_dict()}, 201


@user_bp.route('', methods=['GET'])
@handle_errors
def list_users():
    """
    Listar todos os usuários
    ---
    tags:
      - Users
    responses:
      200:
        description: Lista de usuários
    """
    users = User.query.all()
    return {'users': [u.to_dict() for u in users]}, 200


@user_bp.route('/<int:user_id>', methods=['GET'])
@handle_errors
def get_user(user_id):
    """
    Obter informações do usuário
    ---
    tags:
      - Users
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
    responses:
      200:
        description: Informações do usuário
      404:
        description: Usuário não encontrado
    """
    user = user_service.get_user(user_id)
    
    if not user:
        return {'error': 'User not found'}, 404
    
    return {'user': user.to_dict()}, 200


@user_bp.route('/<int:user_id>', methods=['PUT'])
@handle_errors
def update_user(user_id):
    """
    Atualizar informações do usuário
    ---
    tags:
      - Users
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
      - in: body
        name: body
        schema:
          type: object
          properties:
            email:
              type: string
            password:
              type: string
    responses:
      200:
        description: Usuário atualizado
      404:
        description: Usuário não encontrado
    """
    data = request.get_json()
    user = user_service.update_user(user_id, data)
    
    if not user:
        return {'error': 'User not found'}, 404
    
    return {'message': 'User updated successfully', 'user': user.to_dict()}, 200


@user_bp.route('/<int:user_id>', methods=['DELETE'])
@handle_errors
def delete_user(user_id):
    """
    Deletar usuário
    ---
    tags:
      - Users
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
    responses:
      200:
        description: Usuário deletado
      404:
        description: Usuário não encontrado
    """
    success = user_service.delete_user(user_id)
    
    if not success:
        return {'error': 'User not found'}, 404
    
    return {'message': 'User deleted successfully'}, 200
