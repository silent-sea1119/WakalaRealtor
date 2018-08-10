import datetime
import shutil

from db import db


class RepoFileModel(db.Model):
    __tablename__ = "repo_file"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(6))
    originalName = db.Column(db.String(120))
    fileType = db.Column(db.String(4))
    uuid = db.Column(db.String(60))
    usedBy = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow())

    folderId = db.Column(db.Integer,db.ForeignKey('repo_folder.id'))
    folder = db.relationship('RepoFolderModel')

    def __init__(self, name, originalName, fileType, folderId,uuid):
        self.name = name
        self.originalName = originalName
        self.fileType = fileType
        self.folderId = folderId
        self.usedBy = 0
        self.uuid = uuid

    def json(self):
        return {
            "id": self.id, 
            "name": self.name, 
            "originalName": self.originalName, 
            "type": self.fileType, 
            "folderId": self.folderId , 
            'uuid':self.uuid}

    @classmethod
    def find_by_name(cls,name):
        return cls.query.filter_by(name=name).first()

    @classmethod
    def find_by_id(cls,_id):
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def exists(cls,name):
        file = cls.query.filter_by(name=name).first()
        return bool(file)

    @classmethod
    def get_files_by_folder(cls,folderId):
        return cls.query.filter_by(folderId=folderId)

    @classmethod
    def check_if_used(cls):
        return False

    def increase_users(self):
        self.usedBy = self.usedBy + 1
        self.save()

    def decrease_users(self):
        self.usedBy = self.usedBy - 1
        self.save()

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        from App.Managers.FineUploader import FineUploader
        
        FineUploader().handle_file_delete(self)
        db.session.delete(self)
        db.session.commit()
