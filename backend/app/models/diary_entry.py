from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import UniqueConstraint, CheckConstraint

db = SQLAlchemy()


class DiaryEntry(db.Model):
    """Modelo de entrada no diário de animes"""
    __tablename__ = 'diary_entry'
    
    # Constraints
    __table_args__ = (
        UniqueConstraint('user_id', 'anime_id', name='unique_user_anime'),
        CheckConstraint('user_score >= 1 AND user_score <= 10', name='check_user_score'),
    )
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False, index=True)
    anime_id = db.Column(db.Integer, db.ForeignKey('anime.id', ondelete='RESTRICT'), nullable=False, index=True)
    user_score = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='watching', index=True)
    episodes_watched = db.Column(db.Integer, nullable=True, default=0)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Status válidos
    VALID_STATUSES = ['watching', 'completed', 'planned', 'dropped']
    
    def to_dict(self):
        """Converte o modelo para dicionário"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'anime_id': self.anime_id,
            'anime': self.anime.to_dict() if self.anime else None,
            'user_score': self.user_score,
            'status': self.status,
            'episodes_watched': self.episodes_watched,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<DiaryEntry user_id={self.user_id} anime_id={self.anime_id}>'
