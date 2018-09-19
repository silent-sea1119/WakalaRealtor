from flask import render_template,request
from Database.Models.Post import PostModel
from Database.Models.Article import ArticleModel
from Database.Models.Tag import TagModel

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

            post.set_visitor(request.remote_addr)
            
            return {"error":0,"content":x}
        else :
            return {"error": 1 }

    @staticmethod
    def getPosts(offset):
        posts = PostModel.get_posts_by_offset(offset)
        tags = []

        for p in posts:
            post = p.get_post()

            ts = post.tags

            for t in ts:
                if t.tagId not in tags:
                    tags.append(t.tagId)

        tagsFound = TagModel.get_all_tags(tags)
        content = []

        for p in posts:
            x = {}
            post = p.get_post()
            x['log'] = p.json()
            x['post'] = post.json()
            x['post']['body'] = ""

            ts = post.tags
            xtags = []

            for t in ts:
                for y in tagsFound:
                    if t.tagId == y.id:
                        xtags.append(y.json())

            x['tags'] = xtags

            content.append(x)

        return {"error": 0, "content": content}

    @staticmethod
    def getTopArticles(number):
        articles = ArticleModel.get_top_articles(number)
        tags = []

        for a in articles:
            ts = a.tags

            for t in ts:
                if t.tagId not in tags:
                    tags.append(t.tagId) 

        tagsFound = TagModel.get_all_tags(tags)
        postLogs = PostModel.find_by_posts([x.id for x in articles])
        content = []

        for a in articles:
            x = {}

            for pl in postLogs:
                if pl.postId == a.id:
                    x['log'] = pl.json()
                    break

            x['post'] = a.json()
            x['post']['body'] = ""

            ts = a.tags
            xtags = []

            for t in ts:
                for y in tagsFound:
                    if t.tagId == y.id:
                        xtags.append(y.json())

            x['tags'] = xtags

            content.append(x)

        return {"error": 0, "content": content}


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

