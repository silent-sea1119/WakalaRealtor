from flask import render_template

class MainController:

    def home(self):
        return render_template("main/home.html")