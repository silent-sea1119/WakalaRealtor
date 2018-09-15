import datetime
import shutil

from db import db

class ArticleTagModel(db.Model):
    __tablename__ = "article_tags"

    id = db.Column(db.Integer, primary_key=True)
    articleId = db.Column(db.Integer , db.ForeignKey("articles.id"))
    tagId = db.Column(db.Integer,db.ForeignKey('tags.id'))

    article = db.relationship('ArticleModel')
    tag = db.relationship('TagModel')

    def __init__(self, articleId, tagId):
        self.articleId = articleId
        self.tagId = tagId

    def json(self):
        return {"id": self.id, "tagId" : self.tagId }

    def get_tag_name(self):
        return self.tag.json()

    @classmethod
    def find_by_id(cls,_id):
        return cls.query.filter(id=_id).first()

    @classmethod
    def update_tags(cls,articleId, updatedTags):
        try :
            tags = cls.query.filter_by(articleId = articleId)
            s = [t.tagId for t in tags]
            
            for tag in tags:
                if tag.tagId not in updatedTags:
                    tag.delete()
            

            for x in updatedTags:
                if x not in s:
                    newTag = ArticleTagModel(articleId,x)
                    newTag.save()

            return True
        except:
            return False

    @classmethod
    def delete_all_article_tags(cls,articleId):
        try :
            tags = cls.query.filter_by(articleId = articleId)
        
            for tag in tags:
                tag.delete()

            return True
        except : 
            return False

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
