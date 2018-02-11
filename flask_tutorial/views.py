from flask import Flask, render_template, request, redirect, url_for, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_tutorial import app, db
from flask_tutorial.models import User

@app.route("/")
def show():
    user_list = User.query.all()
    return render_template('index.html', user_list=user_list)

@app.route("/add_user", methods=['POST'])
def add_user():
    username = request.form.get('username')
    if username:
        user = User(username)
        db.session.add(user)
        db.session.commit()

    return redirect(url_for('show'))