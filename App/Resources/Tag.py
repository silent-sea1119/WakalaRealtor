from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from App.Models.Tag import TagModel

class Tag(Resource):
    def get(self,param):
        
        if not TagModel.exists(param):
            try:
                tag = TagModel(param)
                tag.save()

                return {"error": 0 , "content" : tag.json()}
            except:
                return {"error": 2}
        else :
            return {"error": 1}

    def delete(self, param):
        file = TagModel.find_by_id(param)

        if file:
            file.delete()
            return {"error": 0}
        else:
            return {"error": 1, "error_msg": "Folder doesn't exist"}


class Tags(Resource):
    def get(self, param):
        try :
            tags = TagModel.search_by_name(param)
            return {"error": 0, "content": [x.json() for x in tags]}
        except:
            return {"error": 1, "error_msg": "Failed to retrieve tags!"}
