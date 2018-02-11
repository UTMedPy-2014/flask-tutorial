from flask_tutorial import app
from flask_tutorial import models

if __name__ == '__main__':
    models.init()
    app.run(debug=True)