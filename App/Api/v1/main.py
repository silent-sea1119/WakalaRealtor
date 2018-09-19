from os import path

from flask_restful import Api
from flask import (Blueprint,jsonify, send_from_directory)

from App.Api.v1.Controllers import MainController
from App.Api.v1.Resources import Comment, CommentReaction
from db import db

root = path.abspath(path.dirname('./'))

api_v1_main = Blueprint('api_v1_main', __name__)
api = Api(api_v1_main)

api.add_resource(
    Comment, '/comment/<string:param>/<string:param2>/<string:offset>')
api.add_resource(
    CommentReaction, '/commentReaction/<string:param>/<string:param2>/<string:param3>')

mc = MainController()


@api_v1_main.route("/")
def index():
    return mc.home()


@api_v1_main.route('/article/<string:param>')
def articlePage(param):
    return mc.articlePage(param)


@api_v1_main.route('/getArticle/<string:param>')
def getArticle(param):
    return jsonify(mc.getArticle(param))


@api_v1_main.route('/getArticles/<string:param>')
def getArticles(param):
    return jsonify(mc.getPosts(param))


@api_v1_main.route('/getTopArticles/<string:param>')
def getTopArticles(param):
    return jsonify(mc.getTopArticles(param))


@api_v1_main.route('/articleReaction/<string:param>/<string:param2>')
def articleReaction(param, param2):
    return jsonify(mc.articleReaction(param, param2))


@api_v1_main.route("/assets/<path:filename>")
def send_asset(filename):
    return send_from_directory(path.join(root, "Public/assets"), filename)


@api_v1_main.route("/repo/<path:filename>")
def send_repo_files(filename):
    return send_from_directory(path.join(root, "Public/repo/upload"), filename)


@api_v1_main.route("/setup")
def setup():
    db.create_all()
    return jsonify({'error': 0})
