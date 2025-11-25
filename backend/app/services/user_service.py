from app.models import db, User
from sqlalchemy.exc import IntegrityError


class UserService:
    """Serviço para operações de usuário"""
    
    def create_user(self, username, email, password):
        """Criar novo usuário"""
        # Validar dados
        if not username or len(username) < 3:
            raise ValueError('Username must be at least 3 characters')
        if not email or '@' not in email:
            raise ValueError('Invalid email')
        if not password or len(password) < 8:
            raise ValueError('Password must be at least 8 characters')
        
        # Verificar se usuário já existe
        if User.query.filter_by(username=username).first():
            raise ValueError('Username already exists')
        if User.query.filter_by(email=email).first():
            raise ValueError('Email already exists')
        
        # Criar usuário
        user = User(username=username, email=email)
        user.set_password(password)
        
        try:
            db.session.add(user)
            db.session.commit()
            return user
        except IntegrityError:
            db.session.rollback()
            raise ValueError('Error creating user')
    
    def authenticate_user(self, username, password):
        """Autenticar usuário"""
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            return user
        return None
    
    def get_user(self, user_id):
        """Obter usuário por ID"""
        return User.query.get(user_id)
    
    def update_user(self, user_id, data):
        """Atualizar usuário"""
        user = User.query.get(user_id)
        
        if not user:
            return None
        
        if 'email' in data:
            if User.query.filter_by(email=data['email']).filter(User.id != user_id).first():
                raise ValueError('Email already exists')
            user.email = data['email']
        
        if 'password' in data:
            if len(data['password']) < 8:
                raise ValueError('Password must be at least 8 characters')
            user.set_password(data['password'])
        
        try:
            db.session.commit()
            return user
        except IntegrityError:
            db.session.rollback()
            raise ValueError('Error updating user')
    
    def delete_user(self, user_id):
        """Deletar usuário"""
        user = User.query.get(user_id)
        
        if not user:
            return False
        
        try:
            db.session.delete(user)
            db.session.commit()
            return True
        except Exception:
            db.session.rollback()
            return False
