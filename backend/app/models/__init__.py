from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from app.models.user import User
from app.models.anime import Anime
from app.models.diary_entry import DiaryEntry

__all__ = ['User', 'Anime', 'DiaryEntry', 'db']
