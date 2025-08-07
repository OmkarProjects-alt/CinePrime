from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Movie(db.Model):
    id = db.Column(db.Integer , primary_key=True)
    movies_id = db.Column(db.Integer , unique=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text , nullable=False)
    duration = db.Column(db.Integer)
    rating = db.Column(db.String(10))
    poster_url =db.Column(db.String(255))
    base_price = db.Column(db.DECIMAL(10, 2), default=10.00)  # Default base price

# class MovieActor(db.Model):
#     id = db.Column(db.Integer)
#     movie_actor_id = db.Column(db.Integer , db.ForeignKey('movie.movies_id'))
#     actor_img_url = db.Column(db.String(255))

class Showtimes(db.Model):
    id = db.Column(db.Integer , primary_key=True)
    movie_id = db.Column(db.Integer , db.ForeignKey('movie.id'))
    showtime = db.Column(db.TIMESTAMP , nullable=False)
    date = db.Column(db.DATE , nullable=False)
    theater = db.Column(db.String , nullable=False)
    available_seats = db.Column(db.Integer ,nullable=False)
    

class Booking(db.Model):
    user_id = db.Column(db.String)
    id = db.Column(db.Integer , primary_key=True)
    showtime_id = db.Column(db.Integer , db.ForeignKey('showtimes.id'))
    movie_id = db.Column(db.Integer , db.ForeignKey('movie.movies_id'))
    theater = db.Column(db.String , nullable =False )
    seats = db.Column(db.String , nullable = False)
    user_email = db.Column(db.String)
    date = db.Column(db.TIMESTAMP , nullable = False)
    movie_title = db.Column(db.String , nullable = False)
    amount = db.Column(db.Integer)
