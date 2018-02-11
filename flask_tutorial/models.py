from flask_tutorial import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)

    def __init__(self, username):
        self.username = username
class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(80), unique=True)
    #password = db.Column(db.String(80), unique=True)

    def __init__(self, email):
        self.email = email

def init():
    db.create_all()