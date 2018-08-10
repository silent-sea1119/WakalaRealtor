import datetime
from db import db

class ArticleStatsModel(db.Model):
    __tablename__ = "article_stats"

    id = db.Column(db.Integer, primary_key=True)
    articleId = db.Column(db.Integer,db.ForeignKey('articles.id'))
    user = db.Column(db.String(60))
    reaction = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow())

    #Reaction
    #1 - Liked
    #2 - Disliked

    article = db.relationship('ArticleModel')

    def __init__(self, articleId, user):
        self.articleId = articleId
        self.user = user
        self.reaction = 0

    def json(self):
        return {"id": self.id, "reaction" : self.reaction}


    @classmethod
    def find_by_id(cls,_id):
        return cls.query.filter(id=_id).first()


    @classmethod
    def find_by_user(cls,user,articleId):
        return cls.query.filter(user=user, articleId=articleId).first()


    @classmethod
    def check_if_user_has_seen(cls,user,articleId):
        stat = cls.query.filter(user=user, articleId=articleId).first()
        return  bool(stat)

    @classmethod
    def delete_all_article_stats(cls,articleId):
        try :
            stats = cls.query.filter_by(articleId = articleId)
        
            for s in stats:
                s.delete()

            return True
        except : 
            return False

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
