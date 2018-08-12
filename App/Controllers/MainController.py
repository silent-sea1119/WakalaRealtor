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
            post.get_stats()
            
            x['post'] = post.json()
            x['post']['tags'] = post.get_tags()

            p.post.set_visitor(request.remote_addr)
            
            return {"error":0,"content":x}
        else :
            return {"error": 1 }

    def articleReaction(self, param, param2):
        try:
            if int(param2) <= 2:
                comment = ArticleModel.find_by_id(int(param))

                if comment:
                    comment.set_reaction(request.remote_addr, int(param2))
                    return {"error": 0}
                else:
                    return {"error": 3}
            else:
                return {"error": 2}
        except:
            return {"error": 1}

