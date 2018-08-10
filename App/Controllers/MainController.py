from flask import render_template
from App.Models.Post import PostModel

class MainController:

    def home(self):
        return render_template("main/home.html")

    def articlePage(self, param):
        return render_template('main/article.html',articleId = param)

    def getArticle(self,param):
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
