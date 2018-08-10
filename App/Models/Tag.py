from db import db

class TagModel(db.Model):
    __tablename__ = "tags"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))

    article = db.relationship('ArticleTagModel')

    def __init__(self, name):
        self.name = name.lower()

    def json(self):
        return {"id": self.id, "name": self.name }

    @classmethod
    def find_by_id(cls,_id):
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def search_by_name(cls,name):
        return cls.query.filter(cls.name.like('%' + name + '%'))

    @classmethod
    def exists(cls,name):
        query = cls.query.filter_by(name=name).first()
        return bool(query)

    @classmethod
    def get_all_tags(cls,tags):
        return cls.query.filter(cls.id.in_(tags))

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
