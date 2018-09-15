from App.app import app
import pytest

@pytest.fixture(scope="session")
def testClient():
    app.config["TESTING"] = True
    
    return app.test_client()
