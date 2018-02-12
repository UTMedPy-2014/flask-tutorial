from flask_tutorial import db

class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(80), unique=True)
    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

def init():
    db.create_all()