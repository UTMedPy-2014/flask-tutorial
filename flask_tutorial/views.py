from flask import Flask, render_template, request, redirect, url_for, jsonify, make_response
from flask_tutorial import app, db
from flask_tutorial.models import Account

@app.route("/")
def index():
    account_list = Account.query.all()
    return render_template('index.html', account_list=account_list)

@app.route("/add_account", methods=['POST'])
def add_account():
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    if username and email and password:
        account = Account(username, email, password)
        db.session.add(account)
        db.session.commit()
    return redirect(url_for('index'))