from flask import Flask
from flask_cors import CORS
from routes import bp
from flask import Blueprint
from models import db
from datetime import timedelta
from flask_mail import Mail
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config.from_object('config.Config')

app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # For Gmail
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = 'omkar.gudappe205@gmail.com'  # Your email
app.config['MAIL_PASSWORD'] = 'unin ewob nxmk yfik'  # Use App Password for Gmail
app.config['MAIL_DEFAULT_SENDER'] = 'omkar.gudappe205@gmail.com'

mail = Mail(app)

app.secret_key = ';kljadsf'  # Should match your config.py

db.init_app(app)

CORS(app, 
     supports_credentials=True,
     resources={r"/api/*": {
         "origins": ["http://localhost:3000", "http://10.2.0.2:3000"], 
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
         "allow_headers": ["Content-Type", "Authorization"],
         "expose_headers": ["Content-Type"]
     }}
)

is_production = os.getenv("FLASK_ENV") == "production"

app.config.update(
    SESSION_COOKIE_SECURE=True,           # True if in production with HTTPS
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
    PERMANENT_SESSION_LIFETIME=timedelta(hours=2)
)

app.register_blueprint(bp, url_prefix="/api")
print("✅ Flask started at /api/movies")


if __name__ == '__main__':
    app.run(debug=True)