from flask import Flask, render_template, request, redirect, url_for, jsonify, make_response
from flask_tutorial import app, db
from flask_tutorial.models import Account
from flask_tutorial.tools import rsa

@app.route("/")
def index():
    account_list = Account.query.all()
    return render_template('index.html', account_list=account_list)

@app.route("/add_account", methods=['POST'])
def add_account():
    username = request.form.get('username')
    email = request.form.get('email')
    public_key, private_key = rsa.generate_keys(103, 3259)#65521
    password_enc = rsa.encrypt(request.form.get('password'), public_key)
    if username and email and password_enc:
        account = Account(username, email, password_enc)
        db.session.add(account)
        db.session.commit()
        print(rsa.sanitize(rsa.decrypt(password_enc, private_key)))
    return redirect(url_for('index'))