from App import create_app

if __name__ == "__main__":
    app = create_app('DEV')
    app.run(extra_files=app.config["WEBPACK_MANIFEST_PATH"])