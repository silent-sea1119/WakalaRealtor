from db import db

class RevokedTokenModel(db.Model):
    __tablename__ = 'expired_tokens'
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(120))

    def __init__(self,token):
        self.token = token

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def is_token_blacklisted(cls, jti):
        query = cls.query.filter_by(token=jti).first()
        return bool(query)
