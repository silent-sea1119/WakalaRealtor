from os import path

import pkg_resources

from App.Controllers.Controllers import AdminController, MainController
from Database.Models.RevokedToken import RevokedTokenModel
from App.Resources.Resources import (AdminArticle, AdminUser, Comment,
                                     CommentReaction, Post, RepoFile,
                                     RepoFolder, Tag, Tags, UploadAPI)

from db import db
from flask import (Flask, jsonify, redirect, render_template,
                   send_from_directory, url_for)
from flask_jwt_extended import (JWTManager, create_access_token,
                                get_jwt_identity, jwt_refresh_token_required,
                                jwt_required, set_access_cookies)
from flask_restful import Api
from flask_webpack import Webpack

#   __version__ = pkg_resources.require("AngelaBlog")[0].version
here = path.abspath(path.dirname('./'))
template_dir = path.abspath('./Resources/Views/')

app = Flask(__name__, template_folder=template_dir)

app.config.from_envvar('APP_SETTINGS')
app.config.from_object("config.DevelopmentConfig")

webpack = Webpack()
webpack.init_app(app)

api = Api(app)
db.init_app(app)

ac = AdminController()
mc = MainController()

jwt = JWTManager(app)

@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return RevokedTokenModel.is_token_blacklisted(jti)


#jwt.unauthorized_loader
@jwt.invalid_token_loader
@jwt.expired_token_loader
def redirect_to_login(e):
    return redirect(url_for("adminLogin"))


api.add_resource(AdminUser,'/admin/user/<string:name>')
api.add_resource(RepoFolder, '/admin/repoFolder/<string:param>')
api.add_resource(RepoFile,'/admin/repoFile/<string:id>')
api.add_resource(Tag,'/admin/tag/<string:param>')
api.add_resource(Tags, '/admin/tags/<string:param>')
api.add_resource(Post,'/admin/post/<string:param>')
api.add_resource(AdminArticle,'/admin/article/<string:param>')
api.add_resource(Comment,'/comment/<string:param>/<string:param2>/<string:offset>')
api.add_resource(CommentReaction,'/commentReaction/<string:param>/<string:param2>/<string:param3>')


upload_view = UploadAPI.as_view('upload_view')
app.add_url_rule('/admin/uploadFiletoRepo',
                 view_func=upload_view, methods=['POST', ])
app.add_url_rule('/admin/uploadFiletoRepo/<uuid>',
                 view_func=upload_view, methods=['DELETE', ])


@app.route("/")
def index():
    return mc.home()


@app.route('/article/<string:param>')
def articlePage(param):
    return mc.articlePage(param)


@app.route('/getArticle/<string:param>')
def getArticle(param):
    return jsonify(mc.getArticle(param))


@app.route('/getArticles/<string:param>')
def getArticles(param):
    return jsonify(mc.getPosts(param))


@app.route('/getTopArticles/<string:param>')
def getTopArticles(param):
    return jsonify(mc.getTopArticles(param))


@app.route('/articleReaction/<string:param>/<string:param2>')
def articleReaction(param,param2):
    return jsonify(mc.articleReaction(param,param2))



@app.route("/admin/login")
def adminLogin():
    return ac.adminLoginPage()


@app.route('/admin/loginAuth', methods=['POST'])
def loginAuth():
    return ac.loginAuth()


@app.route('/admin/logout')
@jwt_required
def adminLogOutAccess():
    return ac.adminLogOut()


@app.route('/api/key2/logout')
@jwt_refresh_token_required
def adminLogOutRefresh():
    return ac.adminLogOut()


@app.route('/api/key2/refresh')
@jwt_refresh_token_required
def refesh_token():
    user = get_jwt_identity()
    resp = jsonify({'error': 0})
    set_access_cookies(resp, create_access_token(identity=user))
    return resp


@app.route('/admin/repo')
def adminRepo():
    return ac.repoPage()


@app.route('/admin/posts')
def postsPage():
    return ac.postsPage()


@app.route('/admin/addArticle')
def addArticlePage():
    return ac.addArticlePage()


@app.route('/admin/editArticle/<string:param>')
def adminEditArticle(param):
    return ac.editArticlePage(int(param))


@app.route('/admin/retrieveRepoContentByFolder/<string:id>')
def retrieveRepoContentByFolder(id):
    return ac.retrieveRepoContentByFolder(id)


@app.route('/admin/getData')
def adminGetData():
    return jsonify(ac.adminData())


@app.route('/admin/getPosts/<string:offset>')
def adminPosts(offset):
    return jsonify(ac.getPosts(int(offset)))


@app.route("/assets/<path:filename>")
def send_asset(filename):
    return send_from_directory(path.join(here, "Public/assets"), filename)
    

@app.route("/repo/<path:filename>")
def send_repo_files(filename):
    return send_from_directory(path.join(here, "Public/repo/upload"), filename)


@app.route("/setup")
def setup():
    db.create_all()
    return jsonify({'error':0})
    