from datetime import datetime
from app.models import db


class Anime(db.Model):
    """Modelo de anime"""
    __tablename__ = 'anime'
    
    id = db.Column(db.Integer, primary_key=True)
    mal_id = db.Column(db.Integer, unique=True, nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False, index=True)
    synopsis = db.Column(db.Text, nullable=True)
    score = db.Column(db.Float, nullable=True)
    episodes = db.Column(db.Integer, nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    status = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    diary_entries = db.relationship('DiaryEntry', backref='anime', lazy=True)
    
    def to_dict(self):
        """Converte o modelo para dicionário"""
        return {
            'id': self.id,
            'mal_id': self.mal_id,
            'title': self.title,
            'synopsis': self.synopsis,
            'score': self.score,
            'episodes': self.episodes,
            'image_url': self.image_url,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Anime {self.title}>'
