from db import db
from werkzeug.security import check_password_hash

class AdminUserModel(db.Model):
    __tablename__ = "admin_user"

    id = db.Column(db.Integer,primary_key=True)
    username = db.Column(db.String(16))
    password = db.Column(db.String(160))

    def __init__(self,username,password):
        self.username = username
        self.password = password

    def json(self):
        return {"id":self.id,"username":self.username}

    @classmethod
    def find_by_username(cls,name):
        return cls.query.filter_by(username=name).first()

    @classmethod
    def find_by_id(cls,_id):
        return cls.query.filter(id=_id).first()

    def authenticate(self,password):
        return check_password_hash(self.password,password)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()




