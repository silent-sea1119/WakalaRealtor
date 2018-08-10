from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from App.Models.RepoFolder import RepoFolderModel

class RepoFolder(Resource):

    def post(self,param):
        parser = reqparse.RequestParser()
        parser.add_argument("parentId",required=True , help="A parent folder id is required")
        parser.add_argument("name",required=True,help="A name is required")

        data = parser.parse_args()
        
        if RepoFolderModel().exists(data.name,data.parentId):
            return {    "error":1   }
        else :
            newFolder = RepoFolderModel()
            newFolder.name = data.name

            if data.parentId == "root":
                 data.parentId = 0

            newFolder.parent = data.parentId
          
            newFolder.save()
            return {    "error": 0  }

    def put(self,param):
        parser = reqparse.RequestParser()
        parser.add_argument("folderId",required=True , help="A folder id is required")
        parser.add_argument("name",required=True,help="A folder name is required")

        data = parser.parse_args()

        folder = RepoFolderModel().find_by_id(int(data.folderId))

        if bool(folder):
            folder.name = data.name
            folder.save()
            return {"error": 0}
        else :
            return {
                "error":1,
                "error_msg":"Folder doesn't exist!"
            }

    def get(self, param):
        folder = RepoFolderModel().find_by_id(param)

        if folder :
            occupied = folder.check_if_contains_content(param)

            if not occupied:
                folder.delete()
                return {"error": 0}
            else:
                return {"error": 1, "error_msg": "Folder contains files and/or folders"}

        else :
            return {"error": 2, "error_msg": "Folder doesn't exist"}


    def delete(self,param):
        folder = RepoFolderModel().find_by_id(param)
        
        if folder:
            folder.delete()
            return {"error": 0}
        else:
            return {"error": 1, "error_msg": "Folder doesn't exist"}

