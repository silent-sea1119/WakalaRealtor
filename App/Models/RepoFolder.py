from db import db
from App.Models.RepoFile import RepoFileModel

class RepoFolderModel(db.Model):
    __tablename__ = "repo_folder"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60))
    parent = db.Column(db.Integer)

    files = db.relationship('RepoFileModel',lazy="dynamic")

    def __init__(self):
        pass

    def json(self):
        return {"id": self.id, "name": self.name}

    @classmethod
    def find_by_name(cls, name):
        return cls.query.filter_by(name=name).first()

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def exists(cls, name,parent):
        file = cls.query.filter_by(name=name,parent=parent).first()
        return bool(file)

    def get_content(self,folderId):
        files = self.files.all()
        folders = self.query.filter_by(parent=folderId)

        resp = {
            "files":[x.json() for x in files],
            "folders":[x.json() for x in folders]
        }

        return resp

    @classmethod
    def get_root_content(cls,folderId):
        files = RepoFileModel.get_files_by_folder(folderId)
        folders = cls.query.filter_by(parent=folderId)

        resp = {
            "files": [x.json() for x in files],
            "folders": [x.json() for x in folders]
        }

        return resp


    def check_if_contains_content(self, _id):
        files = self.files.all()

        if len(files) > 0 :
            return True
        
        folders = self.query.filter_by(parent = _id).first()
        return bool(folders)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        files = self.files.all()

        for x in files:
            x.delete()

        folders = self.query.filter_by(parent = self.id)

        for x in folders:
            x.delete()

        db.session.delete(self)
        db.session.commit()
