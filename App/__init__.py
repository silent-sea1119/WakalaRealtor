from os import path
from db import db

from flask import Flask,url_for,redirect
from flask_restful import Api
from flask_webpack import Webpack
from flask_jwt_extended import JWTManager

from instance.config import app_config
from App.Api.v1 import api_v1_admin,api_v1_main

from Database.Models.RevokedToken import RevokedTokenModel


def create_app(config_name):
    template_dir = path.abspath('./Resources/Views/')

    app = Flask(__name__, template_folder=template_dir,instance_relative_config=True)

    app.config.from_object(app_config[config_name])
    app.config.from_pyfile('config.py')

    app.register_blueprint(api_v1_main, url_prefix="/api/v1")
    app.register_blueprint(api_v1_admin,url_prefix="/api/v1/admin")

    db.init_app(app)

    webpack = Webpack()
    webpack.init_app(app)

    jwt = JWTManager(app)

    @jwt.token_in_blacklist_loader
    def check_if_token_in_blacklist(decrypted_token):
        jti = decrypted_token['jti']
        return RevokedTokenModel.is_token_blacklisted(jti)


    @jwt.unauthorized_loader
    @jwt.invalid_token_loader
    @jwt.expired_token_loader
    def redirect_to_login(e):
        return redirect(url_for("adminLogin"))
        
    return app