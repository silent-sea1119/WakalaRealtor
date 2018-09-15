from flask_restful import Resource,reqparse
from Database.Models.AdminUser import AdminUserModel
from werkzeug.security import generate_password_hash

class AdminUser(Resource):
    parser = reqparse.RequestParser()

    parser.add_argument('username',
                required=True,
                help="The username field is required")

    parser.add_argument('password',
                required=True,
                help="The password field is required")

    def post(self,name):
        data = AdminUser.parser.parse_args()

        if AdminUserModel.find_by_username(data.username):
            return {"error":1,"error_msg":"User already exists!"}
        else    :
            user = AdminUserModel(
                data.username, 
                generate_password_hash(data.password))
            user.save()
            return {"error": 0}
    
    def delete(self,name):
        user = AdminUserModel.find_by_username(name)

        if user:
            user.delete()
            return {"error": 0}
        else : 
            return {"error":1, "error_msg":"User doesn't exist"}
