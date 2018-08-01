import pkg_resources
from db import db

from os import environ, path
from flask import Flask, render_template, send_from_directory,jsonify
from flask_webpack import Webpack
from flask_restful import Api
from flask_jwt_extended import JWTManager,jwt_required,get_jwt_identity,create_access_token,jwt_refresh_token_required

from App.Controllers.AdminController import AdminController
from App.Controllers.MainController import MainController
from App.Resources.Admin import AdminUser
from App.Models.RevokedToken import RevokedTokenModel


#   __version__ = pkg_resources.require("AngelaBlog")[0].version
here = path.abspath(path.dirname('./'))
template_dir = path.abspath('./Resources/Views/')

app = Flask(__name__, template_folder=template_dir)
debug = "DEBUG" in environ

webpack = Webpack()
app.config["WEBPACK_MANIFEST_PATH"] = path.join(here, "manifest.json")
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:m21c07s96@127.0.0.1/angelablog'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['PROPAGATE_EXCEPTIONS'] = True
app.secret_key = b'\x0c$V\x92\x1b1\x05xp@\xfa\xdc\x94\x87\xc4\x0f'

webpack.init_app(app)
api = Api(app)
db.init_app(app)

ac = AdminController()
mc = MainController()

jwt = JWTManager(app)
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return RevokedTokenModel.is_token_blacklisted(jti)

api.add_resource(AdminUser,'/admin/user/<string:name>')

@app.route("/")
def index():
    return mc.home()


@app.route("/admin/login")
def adminLogin():
    return ac.adminLoginPage()


@app.route('/admin/loginAuth', methods=['POST'])
def loginAuth():
    return jsonify(ac.loginAuth())


@app.route('/admin/logout')
@jwt_required
def adminLogOutAccess():
    return ac.adminLogOut()


@app.route('/admin/lorf')
@jwt_refresh_token_required
def adminLogOutRefresh():
    return jsonify(ac.adminLogOut())


@app.route('/admin/repo')
@jwt_required
def adminRepo():
    return ac.repoPage()


@app.route('/admin/tr')
@jwt_refresh_token_required
def refesh_token():
    user = get_jwt_identity()
    access_token = create_access_token(identity=user)
    return {'error':0,'access_token': access_token}


@app.route("/assets/<path:filename>")
def send_asset(filename):
    return send_from_directory(path.join(here, "Public/assets"), filename)

@app.route("/setup")
def setup():
    db.create_all()
    return jsonify({'error':0})


if __name__ == "__main__":
    app.debug = debug
    app.run(extra_files=[app.config["WEBPACK_MANIFEST_PATH"]], port=5000)
