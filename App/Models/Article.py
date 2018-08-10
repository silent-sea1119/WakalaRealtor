from db import db
from App.Models.ArticleTag import ArticleTagModel
from App.Models.RepoFile import RepoFileModel

class ArticleModel(db.Model):
    __tablename__ = "articles"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80))
    author = db.Column(db.String(120))
    body = db.Column(db.String(60000))
    summary = db.Column(db.String(200))
    imageId = db.Column(db.Integer, db.ForeignKey("repo_file.id"))
    views = db.Column(db.Integer)
    likes = db.Column(db.Integer)
    comments = db.Column(db.Integer)

    db.relationship('PostModel')
    image = db.relationship('RepoFileModel')
    tags = db.relationship('ArticleTagModel')

    def __init__(self, title, author, body, summary, imageId):
        self.title = title
        self.author = author
        self.body = body
        self.summary = summary
        self.imageId = imageId
        self.views = 0
        self.likes = 0
        self.comments = 0


    def json(self):
        return {
            "id": self.id, 
            "title": self.title,
            "author": self.author, 
            "body": self.body, 
            "summary": self.summary, 
            'image': self.image.json(),
            "stat":{
                "views":self.views,
                "likes":self.likes,
                "comments":self.comments
            }
         }


    @classmethod
    def find_by_id(cls,_id):
        return cls.query.filter_by(id=_id).first()

    def get_tags(self):
        return [x.get_tag_name() for x in self.tags]

    def save(self):
        db.session.add(self)
        db.session.commit()


    def delete(self):
        ArticleTagModel.delete_all_article_tags()
        image = RepoFileModel.find_by_id(self.imageId)
        image.decrease_user()
        
        db.session.delete(self)
        db.session.commit()
