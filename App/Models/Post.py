import datetime
from db import db
from App.Models.Article import ArticleModel

class PostModel(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    postId = db.Column(db.Integer)
    postType = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow())


    def __init__(self, postId , postType):
        self.postId = postId
        self.postType = postType


    def json(self):
        return {
            "id": self.id, 
            "postId": self.postId, 
            "type": self.postType ,
            "created_at": str(self.created_at)
            }


    @classmethod
    def find_by_id(cls,_id):
        return cls.query.filter_by(id=_id).first()


    @classmethod
    def exists(cls,name):
        file = cls.query.filter_by(name=name).first()
        return bool(file)


    @classmethod
    def get_posts_by_offset(cls, offset):
        return cls.query.order_by(cls.created_at).offset(offset).limit(15).all()


    def get_post(self):
        if self.postType == 1:
            return ArticleModel.find_by_id(self.postId)

    def save(self):
        db.session.add(self)
        db.session.commit()


    def delete(self):

        if self.postType == 1:
            article = ArticleModel.find_by_id(self.postId)

            if article :
                article.delete()
        
        db.session.delete(self)
        db.session.commit()
