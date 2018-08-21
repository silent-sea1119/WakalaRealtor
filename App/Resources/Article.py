from flask_restful import Resource, reqparse
from App.Models.Article import ArticleModel
from App.Models.ArticleTag import ArticleTagModel
from App.Models.Post import PostModel
from App.Models.RepoFile import RepoFileModel
from App.Models.Post import PostModel

from flask import request
import json

class AdminArticle(Resource):
    parser = reqparse.RequestParser()

    parser.add_argument('art__title',
                        required=True,
                        help="The title field is required")

    parser.add_argument('art__author',
                        required=True,
                        help="The author field is required")

    parser.add_argument('art__body',
                         required=True,
                         help="The body field is required")

    parser.add_argument('art__summary',
                         required=True,
                         help="The summary field is required")

    parser.add_argument('art__image',
                         required=True,
                         help="The image field is required")

    parser.add_argument('art__tags',
                         required=True,
                         help="The tags field is required")

    def get(self,param):
        p = PostModel.find_by_id(int(param))
        
        if p:
            x = {}
            x['log'] = p.json()
            post = p.get_post()
            x['post'] = post.json()
            x['post']['tags'] = post.get_tags()

            return {"error":0,"content":x}
        else :
            return {"error": 1 }


    def post(self, param):

        data = AdminArticle.parser.parse_args()

        try :
            article = ArticleModel(
                data.art__title,
                data.art__author,
                data.art__body,
                data.art__summary,
                data.art__image)

            article.save()

            post = PostModel(article.id, 1)
            post.save()

            image = RepoFileModel.find_by_id(data.art__image)
            image.increase_users()

            for tag in json.loads(data.art__tags):
                newTag = ArticleTagModel(article.id, tag)
                newTag.save()
           
            return {"error": 0}
        except:
            return {"error": 1}


    def put(self,param):
        data = AdminArticle.parser.parse_args()

        article = ArticleModel.find_by_id(param)

        if bool(article):
            if article.imageId != data.art__image:
                article.image.decrease_users()
                image = RepoFileModel.find_by_id(data.art__image)
                image.increase_users()

            article.title = data.art__title
            article.author = data.art__author
            article.body = data.art__body
            article.summary = data.art__summary
            article.imageId = data.art__image
            article.save()

            ArticleTagModel.update_tags(article.id, json.loads(data.art__tags))


            try:
                
                return {"error": 0}
            except:
                return {"error": 2}
        else :
            return {"error": 1 ,"error_msg":"Article doesn't exist!"}

