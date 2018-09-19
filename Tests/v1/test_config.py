from App import create_app
import pytest

@pytest.fixture(scope="session")
def testClient():
    app = create_app('TEST')
    return app.test_client()
