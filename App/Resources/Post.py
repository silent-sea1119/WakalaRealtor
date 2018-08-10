from flask_restful import Resource, reqparse
from App.Models.Post import PostModel

class Post(Resource):
    def delete(self, param):

        try :
            post = PostModel.find_by_id(param)
            post.delete()

            return {"error": 0}
        except :
            return {"error": 1, "error_msg": "Post doesn't exist"}           
