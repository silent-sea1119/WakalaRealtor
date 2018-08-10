import datetime
from db import db
from App.Models.User import UserModel

class ArticleCommentStatModel(db.Model):
    __tablename__ = "article_comment_stats"

    id = db.Column(db.Integer, primary_key=True)
    commentId = db.Column(db.Integer, db.ForeignKey('article_comments.id'))
    userId = db.Column(db.Integer,db.ForeignKey('users.id'))
    reaction = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow())

    #Reaction
    #1 - Liked
    #2 - Disliked

    comment = db.relationship('ArticleCommentModel')
    user = db.relationship('UserModel')

    def __init__(self, commentId, user):
        self.commentId = commentId
        self.userId = user
        self.reaction = 0

    def json(self):
        return {"id": self.id, "user": self.userId, "reaction" : self.reaction}


    @classmethod
    def find(cls,cid, userid):
        return cls.query.filter_by(commentId=cid, userId=userid).first()


    @classmethod
    def find_by_comments(cls, comments):
        return cls.query.filter(cls.commentId.in_(comments)).all()


    @classmethod
    def delete_all_comment_stats(cls,commentId):
        try :
            stats = cls.query.filter_by(commentId=commentId)
        
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
