import datetime
from db import db
from App.Models.ArticleCommentStats import ArticleCommentStatModel
from flask import jsonify
from App.Models.User import UserModel

class ArticleCommentModel(db.Model):
    __tablename__ = "article_comments"

    id = db.Column(db.Integer, primary_key=True)
    articleId = db.Column(db.Integer,db.ForeignKey('articles.id'))
    userName = db.Column(db.String(60))
    userEmail = db.Column(db.String(60))
    comment = db.Column(db.String(5000))
    seen = db.Column(db.Boolean)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    #Reaction
    #1 - Liked
    #2 - Disliked

    article = db.relationship('ArticleModel')
    stats = []

    def __init__(self, articleId, userName, userEmail,comment):
        self.articleId = articleId
        self.userName = userName
        self.userEmail = userEmail
        self.comment = comment
        self.seen = False


    def json(self):
        return {
            "id": self.id, 
            "articleId": self.articleId,
            "userName": self.userName,
            "userEmail": self.userEmail,
            "comment": self.comment,
            "stats":[x.json() for x in self.stats],
            "created_at": self.created_at.isoformat()
            }


    @classmethod
    def find_by_id(cls,_id):
        return cls.query.get(_id)

    @classmethod
    def get_comments(cls,id,offset):
        comments = cls.query.filter_by(articleId=id).order_by(
            cls.created_at).offset(offset).limit(30).all()

        cstats = ArticleCommentStatModel.find_by_comments([x.id for x in comments])

        for c in comments:
            c.stats = []
            for s in cstats:
                if s.commentId == c.id:
                    c.stats.append(s)

        return comments


    def set_reaction(self,userid,reaction):
           
        try :
            user = UserModel.find_by_user(userid)

            if not user:
                user = UserModel(userid)
                user.save()
                stat = ArticleCommentStatModel(self.id, user.id)

            else:
                stat = ArticleCommentStatModel.find(self.id, user.id)

                if not stat:
                    stat = ArticleCommentStatModel(self.id, user.id)

            stat.reaction = reaction
            stat.save()
            
            return True
        except:
            return False


    @classmethod
    def delete_all_comments(cls,articleId):
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
        ArticleCommentStatModel.delete_all_comment_stats(self.id)
        
        db.session.delete(self)
        db.session.commit()
