from flask import render_template
from flask_restful import reqparse
from flask_jwt_extended import jwt_required,create_access_token,\
create_refresh_token, get_raw_jwt
from App.Models.RevokedToken import RevokedTokenModel
from App.Models.AdminUser import AdminUserModel

class AdminController:
    def adminLoginPage(self):
        return render_template('admin/login.html')

    def repoPage(self):
        return render_template('admin/repo.html')

    @staticmethod
    def authenticate(username, password):
        user = AdminUserModel.find_by_username(username)
        if user and user.authenticate(password):
            return user

    @staticmethod
    def identity(payload):
        user_id = payload['identity']
        return AdminUserModel.find_by_id(user_id)

    @staticmethod
    def loginAuth():
        parser = reqparse.RequestParser()
        parser.add_argument('username',
                            required=True,
                            help="The username field is required")

        parser.add_argument('password',
                            required=True,
                            help="The password field is required")

        data = parser.parse_args()
        current_user = AdminUserModel.find_by_username(data['username'])

        if not current_user:
            return {"error":1,'message': 'User {} doesn\'t exist'.format(data['username'])}

        if current_user.authenticate(data['password']):
            access_token = create_access_token(identity=data['username'])
            refresh_token = create_refresh_token(identity=data['username'])

            return {
                'error':0,
                'message': 'Logged in as {}'.format(current_user.username),
                'access_token': access_token,
                'refresh_token': refresh_token
            }
        else:
            return {'error':2,'message': 'Wrong credentials'}

    @staticmethod
    def adminLogOut():
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = RevokedTokenModel(token=jti)
            revoked_token.add()
            return {"error":0,'error_msg': 'Access token has been revoked'}
        except:
            return {"error": 1, 'error_msg': 'Something went wrong'}, 500
