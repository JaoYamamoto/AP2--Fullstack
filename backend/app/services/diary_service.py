from app.models import db, DiaryEntry, Anime, User
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError


class DiaryService:
    """Serviço para operações de diário"""
    
    def get_user_diary(self, user_id, status=None, sort_by='created_at', order='desc'):
        """Obter diário completo do usuário"""
        query = DiaryEntry.query.filter_by(user_id=user_id)
        
        # Filtrar por status se fornecido
        if status and status in DiaryEntry.VALID_STATUSES:
            query = query.filter_by(status=status)
        
        # Ordenar
        sort_column = getattr(DiaryEntry, sort_by, DiaryEntry.created_at)
        if order.lower() == 'asc':
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())
        
        return query.all()
    
    def get_entry(self, entry_id, user_id):
        """Obter um registro do diário"""
        return DiaryEntry.query.filter_by(id=entry_id, user_id=user_id).first()
    
    def add_to_diary(self, user_id, data):
        """Adicionar anime ao diário"""
        # Validar dados
        if not data.get('anime_id') or not data.get('user_score'):
            raise ValueError('Missing required fields')
        
        user_score = data.get('user_score')
        if not isinstance(user_score, int) or user_score < 1 or user_score > 10:
            raise ValueError('user_score must be between 1 and 10')
        
        status = data.get('status', 'watching')
        if status not in DiaryEntry.VALID_STATUSES:
            raise ValueError(f'Invalid status. Must be one of: {", ".join(DiaryEntry.VALID_STATUSES)}')
        
        # Verificar se anime existe
        anime = Anime.query.get(data['anime_id'])
        if not anime:
            raise ValueError('Anime not found')
        
        # Verificar se já existe no diário
        existing = DiaryEntry.query.filter_by(
            user_id=user_id,
            anime_id=data['anime_id']
        ).first()
        
        if existing:
            raise ValueError('Anime already in diary')
        
        try:
            entry = DiaryEntry(
                user_id=user_id,
                anime_id=data['anime_id'],
                user_score=user_score,
                status=status,
                episodes_watched=data.get('episodes_watched', 0),
                notes=data.get('notes')
            )
            db.session.add(entry)
            db.session.commit()
            return entry
        except IntegrityError:
            db.session.rollback()
            raise ValueError('Error adding anime to diary')
    
    def update_entry(self, entry_id, user_id, data):
        """Atualizar registro do diário"""
        entry = DiaryEntry.query.filter_by(id=entry_id, user_id=user_id).first()
        
        if not entry:
            return None
        
        try:
            if 'user_score' in data:
                score = data['user_score']
                if not isinstance(score, int) or score < 1 or score > 10:
                    raise ValueError('user_score must be between 1 and 10')
                entry.user_score = score
            
            if 'status' in data:
                if data['status'] not in DiaryEntry.VALID_STATUSES:
                    raise ValueError(f'Invalid status. Must be one of: {", ".join(DiaryEntry.VALID_STATUSES)}')
                entry.status = data['status']
            
            if 'episodes_watched' in data:
                entry.episodes_watched = data['episodes_watched']
            
            if 'notes' in data:
                entry.notes = data['notes']
            
            db.session.commit()
            return entry
        except Exception as e:
            db.session.rollback()
            raise ValueError(f'Error updating entry: {str(e)}')
    
    def remove_from_diary(self, entry_id, user_id):
        """Remover anime do diário"""
        entry = DiaryEntry.query.filter_by(id=entry_id, user_id=user_id).first()
        
        if not entry:
            return False
        
        try:
            db.session.delete(entry)
            db.session.commit()
            return True
        except Exception:
            db.session.rollback()
            return False
    
    def get_stats(self, user_id):
        """Obter estatísticas do diário do usuário"""
        entries = DiaryEntry.query.filter_by(user_id=user_id).all()
        
        if not entries:
            return {
                'total_animes': 0,
                'average_score': 0,
                'completed': 0,
                'watching': 0,
                'planned': 0,
                'dropped': 0,
                'total_episodes': 0
            }
        
        total_animes = len(entries)
        average_score = sum(e.user_score for e in entries) / total_animes if entries else 0
        
        status_counts = {
            'completed': sum(1 for e in entries if e.status == 'completed'),
            'watching': sum(1 for e in entries if e.status == 'watching'),
            'planned': sum(1 for e in entries if e.status == 'planned'),
            'dropped': sum(1 for e in entries if e.status == 'dropped')
        }
        
        total_episodes = sum(e.episodes_watched or 0 for e in entries)
        
        return {
            'total_animes': total_animes,
            'average_score': round(average_score, 2),
            'completed': status_counts['completed'],
            'watching': status_counts['watching'],
            'planned': status_counts['planned'],
            'dropped': status_counts['dropped'],
            'total_episodes': total_episodes
        }
