from App.app import app

if __name__ == "__main__":
    app.run(extra_files=app.config["WEBPACK_MANIFEST_PATH"],port=5000)