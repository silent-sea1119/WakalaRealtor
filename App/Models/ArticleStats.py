import datetime
from db import db

class ArticleStatsModel(db.Model):
    __tablename__ = "article_stats"

    id = db.Column(db.Integer, primary_key=True)
    articleId = db.Column(db.Integer,db.ForeignKey('articles.id'))
    userId = db.Column(db.Integer, db.ForeignKey('users.id'))
    reaction = db.Column(db.Integer)
    seen = db.Column(db.Boolean)
    reactionSeen = db.Column(db.Boolean)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow())

    #Reaction
    #1 - Liked
    #2 - Disliked

    article = db.relationship('ArticleModel')
    user = db.relationship('UserModel')

    def __init__(self, articleId, userId):
        self.articleId = articleId
        self.userId = userId
        self.reaction = 0
        self.seen = False
        self.reactionSeen = False


    def json(self):
        return {
            "id": self.id,
            "user": self.userId,
            "reaction" : self.reaction,
            "seen": self.seen,
            "reactionSeen": self.reactionSeen
            }


    @classmethod
    def find(cls,pid, userid):
        return cls.query.filter_by(articleId=pid, userId=userid).first()


    @classmethod
    def find_by_id(cls,_id):
        return cls.query.get(_id)

    @classmethod
    def find_by_article(cls,pid):
        return cls.query.filter_by(articleId=pid)


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
