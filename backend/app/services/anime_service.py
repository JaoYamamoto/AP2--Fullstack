from app.models import db, Anime
import requests
from flask import current_app
from sqlalchemy.exc import IntegrityError


class AnimeService:
    """Serviço para operações de anime"""
    
    def search_animes(self, query, limit=12):
        """Buscar animes na API Jikan e salvar no banco"""
        try:
            # Buscar na API Jikan
            url = f"{current_app.config['JIKAN_API_URL']}/anime"
            params = {'q': query, 'limit': limit}
            timeout = current_app.config['JIKAN_API_TIMEOUT']
            
            response = requests.get(url, params=params, timeout=timeout)
            response.raise_for_status()
            
            data = response.json()
            animes = []
            
            # Salvar animes no banco
            for anime_data in data.get('data', []):
                anime = self._save_or_update_anime(anime_data)
                if anime:
                    animes.append(anime)
            
            return animes
        except requests.RequestException as e:
            raise ValueError(f'Error fetching from Jikan API: {str(e)}')
    
    def _save_or_update_anime(self, anime_data):
        """Salvar ou atualizar anime no banco"""
        try:
            mal_id = anime_data.get('mal_id')
            
            # Verificar se anime já existe
            anime = Anime.query.filter_by(mal_id=mal_id).first()
            
            if not anime:
                anime = Anime(
                    mal_id=mal_id,
                    title=anime_data.get('title', ''),
                    synopsis=anime_data.get('synopsis'),
                    score=anime_data.get('score'),
                    episodes=anime_data.get('episodes'),
                    image_url=anime_data.get('images', {}).get('jpg', {}).get('image_url'),
                    status=anime_data.get('status')
                )
                db.session.add(anime)
            else:
                # Atualizar informações
                anime.score = anime_data.get('score', anime.score)
                anime.episodes = anime_data.get('episodes', anime.episodes)
                anime.status = anime_data.get('status', anime.status)
            
            db.session.commit()
            return anime
        except Exception as e:
            db.session.rollback()
            raise ValueError(f'Error saving anime: {str(e)}')
    
    def get_anime(self, anime_id):
        """Obter anime por ID"""
        return Anime.query.get(anime_id)
    
    def create_anime(self, data):
        """Criar novo anime manualmente"""
        if not data.get('mal_id') or not data.get('title'):
            raise ValueError('Missing required fields')
        
        # Verificar se anime já existe
        if Anime.query.filter_by(mal_id=data['mal_id']).first():
            raise ValueError('Anime already exists')
        
        try:
            anime = Anime(
                mal_id=data['mal_id'],
                title=data['title'],
                synopsis=data.get('synopsis'),
                score=data.get('score'),
                episodes=data.get('episodes'),
                image_url=data.get('image_url'),
                status=data.get('status')
            )
            db.session.add(anime)
            db.session.commit()
            return anime
        except IntegrityError:
            db.session.rollback()
            raise ValueError('Error creating anime')
    
    def update_anime(self, anime_id, data):
        """Atualizar anime"""
        anime = Anime.query.get(anime_id)
        
        if not anime:
            return None
        
        try:
            if 'title' in data:
                anime.title = data['title']
            if 'synopsis' in data:
                anime.synopsis = data['synopsis']
            if 'score' in data:
                anime.score = data['score']
            if 'episodes' in data:
                anime.episodes = data['episodes']
            if 'image_url' in data:
                anime.image_url = data['image_url']
            if 'status' in data:
                anime.status = data['status']
            
            db.session.commit()
            return anime
        except Exception:
            db.session.rollback()
            raise ValueError('Error updating anime')
    
    def delete_anime(self, anime_id):
        """Deletar anime"""
        anime = Anime.query.get(anime_id)
        
        if not anime:
            return False
        
        try:
            db.session.delete(anime)
            db.session.commit()
            return True
        except Exception:
            db.session.rollback()
            return False
