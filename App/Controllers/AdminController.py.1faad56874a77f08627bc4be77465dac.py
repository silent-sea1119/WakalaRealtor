from flask import render_template,jsonify
from flask_restful import reqparse
from flask_jwt_extended import jwt_required,create_access_token,create_refresh_token, get_raw_jwt, set_access_cookies,set_refresh_cookies,unset_jwt_cookies
from App.Models.RevokedToken import RevokedTokenModel
from App.Models.AdminUser import AdminUserModel
from App.Models.RepoFolder import RepoFolderModel
from App.Models.Article import ArticleModel
from App.Models.Post import PostModel
from App.Models.Tag import TagModel

class AdminController:
    def adminLoginPage(self):
        return render_template('admin/login.html')

    def repoPage(self):
        return render_template('admin/repo.html')

    def postsPage(self):
        return render_template('admin/posts.html')

    def addArticlePage(self):
        return render_template('admin/addArticle.html')

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
            return jsonify({"error": 1, 'message': 'User {} doesn\'t exist'.format(data['username'])})

        if current_user.authenticate(data['password']):
            access_token = create_access_token(identity=current_user.id)
            refresh_token = create_refresh_token(identity=current_user.id)

            resp = jsonify({
                'error': 0,
                'message': 'Logged in as {}'.format(current_user.username)
            })

            set_access_cookies(resp,access_token,900)
            set_refresh_cookies(resp,refresh_token)

            return resp , 200
        else:
            return jsonify({'error': 2, 'message': 'Wrong credentials'})

    @staticmethod
    def adminLogOut():
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = RevokedTokenModel(token=jti)
            revoked_token.add()

            resp = jsonify({"error":0,'error_msg': 'Access token has been revoked'})
            unset_jwt_cookies(resp)

            return resp
        except:
            return jsonify({"error": 1, 'error_msg': 'Something went wrong'}), 500

    @staticmethod
    def adminData():
        return jsonify({'error': 0})

    @staticmethod
    def retrieveRepoContentByFolder(folderId):
        if folderId == "root":
            content = RepoFolderModel().get_root_content(folderId)
            return jsonify({"error": 0, "content": content})

        else :
            folder = RepoFolderModel().find_by_id(folderId)
            if bool(folder):
                content = RepoFolderModel().get_content(folderId)
                return jsonify({"error": 0, "content": content})
            else:
                return jsonify({"error":1, "error_msg":"Folder doesn't exist!"})

    @staticmethod
    def getPosts(offset):
        posts = PostModel.get_posts_by_offset(offset)
        print(posts)
        tags = []

        for p in posts:
            ts = p.post.tags

            for t in ts:
                if t.tagId not in tags:
                    tags.append(t.tagId)

        tagsFound = TagModel.get_all_tags(tags)
        content = []

        for p in posts:
            x = p.post.json()
            ts = p.post.tags
            xtags = []

            for t in ts:
                for y in tagsFound:
                    if t.tagId == y.id:
                        xtags.append(y.json())
            
            x.append( {"tags": xtags})

            content.append(x)


        return {"error":0,"content":content}
