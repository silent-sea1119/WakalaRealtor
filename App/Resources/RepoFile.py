from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from App.Models.RepoFile import RepoFileModel

class RepoFile(Resource):
    def get(self, id):
        file = RepoFileModel.find_by_id(id)

        if file :
            used = file.check_if_used()

            if not used:
                file.delete()
                return {"error": 0}
            else:
                return {"error": 1, "error_msg": "File is being used"}

        else :
            return {"error": 2, "error_msg": "File doesn't exist"}


    def delete(self,id):
        file = RepoFileModel.find_by_id(id)
        
        if file:
            file.delete()
            return {"error": 0}
        else:
            return {"error": 1, "error_msg": "Folder doesn't exist"}

