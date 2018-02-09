from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+pygresql://bgkiufczunefhd:51ec6c68a39fb898f7ac65852310738342b0f0dee77791bdd966917ea4ce754d@ec2-184-72-228-128.compute-1.amazonaws.com:5432/d2vp2fv24j2sc9'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)

    def __init__(self, username):
        self.username = username

@app.route("/")
def hello():
    user_list = User.query.all()
    return render_template('index.html', user_list=user_list)

@app.route("/add_user", methods=['POST'])
def add_user():
    username = request.form.get('username')
    if username:
        user = User(username)
        db.session.add(user)
        db.session.commit()

    return redirect(url_for('hello'))

if __name__ == '__main__':
    app.run(debug=True)