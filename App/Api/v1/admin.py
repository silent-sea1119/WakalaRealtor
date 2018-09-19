from os import path

from flask_restful import Api
from flask import (Blueprint, jsonify, redirect, render_template,
                   send_from_directory, url_for)
from flask_jwt_extended import (create_access_token,
                                get_jwt_identity, jwt_refresh_token_required,
                                jwt_required, set_access_cookies)

from App.Api.v1.Controllers import AdminController
from App.Api.v1.Resources import AdminArticle, AdminUser, Post, RepoFile, RepoFolder, Tag, Tags, UploadAPI

api_v1_admin = Blueprint('api_v1_admin', __name__)
api = Api(api_v1_admin)

api.add_resource(UploadAPI, '/uploadFiletoRepo',
                 '/uploadFiletoRepo/<uuid>')
api.add_resource(AdminUser, '/user/<string:name>')
api.add_resource(RepoFolder, '/repoFolder/<string:param>')
api.add_resource(RepoFile, '/repoFile/<string:id>')
api.add_resource(Tag, '/tag/<string:param>')
api.add_resource(Tags, '/tags/<string:param>')
api.add_resource(Post, '/post/<string:param>')
api.add_resource(AdminArticle, '/article/<string:param>')

ac = AdminController()

@api_v1_admin.route("/login")
def adminLogin():
    return ac.adminLoginPage()


@api_v1_admin.route('/loginAuth', methods=['POST'])
def loginAuth():
    return ac.loginAuth()


@api_v1_admin.route('/logout')
@jwt_required
def adminLogOutAccess():
    return ac.adminLogOut()


@api_v1_admin.route('/api/key2/logout')
@jwt_refresh_token_required
def adminLogOutRefresh():
    return ac.adminLogOut()


@api_v1_admin.route('/api/key2/refresh')
@jwt_refresh_token_required
def refesh_token():
    user = get_jwt_identity()
    resp = jsonify({'error': 0})
    set_access_cookies(resp, create_access_token(identity=user))
    return resp


@api_v1_admin.route('/repo')
def adminRepo():
    return ac.repoPage()


@api_v1_admin.route('/posts')
def postsPage():
    return ac.postsPage()


@api_v1_admin.route('/addArticle')
def addArticlePage():
    return ac.addArticlePage()


@api_v1_admin.route('/editArticle/<string:param>')
def adminEditArticle(param):
    return ac.editArticlePage(int(param))


@api_v1_admin.route('/retrieveRepoContentByFolder/<string:id>')
def retrieveRepoContentByFolder(id):
    return ac.retrieveRepoContentByFolder(id)


@api_v1_admin.route('/getData')
def adminGetData():
    return jsonify(ac.adminData())


@api_v1_admin.route('/getPosts/<string:offset>')
def adminPosts(offset):
    return jsonify(ac.getPosts(int(offset)))
