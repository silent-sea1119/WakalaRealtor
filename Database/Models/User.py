from db import db
from werkzeug.security import check_password_hash

class UserModel(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer,primary_key=True)
    user = db.Column(db.String(30))

    def __init__(self,user):
        self.user = user

    def json(self):
        return {"id": self.id, "user": self.user}

    @classmethod
    def find_by_user(cls,name):
        return cls.query.filter_by(user=name).first()

    @classmethod
    def find_by_id(cls,_id):
        return cls.query.get(_id)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()




