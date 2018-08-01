from setuptools import setup, find_packages


__version__ = "0.0.1"


setup(
    name="angelablog",
    version=__version__,
    description="A blog for Angela",
    author="Brian K. Bett",
    author_email="bettblake08@hotmail.com",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "Flask>=1.0.2",
        "Flask-Webpack>=0.0.7"
    ]
)
