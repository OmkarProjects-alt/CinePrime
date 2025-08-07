import os
import requests
import random
from datetime import datetime, timedelta , time
from dotenv import load_dotenv
from models import Movie , db , Showtimes , Booking
from flask import Blueprint, jsonify, request , session
from flask_cors import CORS
from flask_mail import Mail , Message 
# import time
from flask import current_app


bp = Blueprint('api', __name__ , url_prefix='/api' )


load_dotenv()

mail = Mail()
otp_store = {}

API_KEY = os.getenv("API_KEY")


@bp.route('/sync-tmdb' , methods=['POST'])
def sync_tmdb():
    try:
        url=f'https://api.themoviedb.org/3/movie/now_playing?api_key={API_KEY}&region=IN&page=1'
        response = requests.get(url)
        data = response.json()

        if not data.get('results'):
            return jsonify({"error": "No movies found in TMDB response"}), 404
        
        count = 0
        for item in data['results']:
            existing = Movie.query.filter_by(title=item['title']).first()

            if not existing:
                # Handle missing poster_path
                poster_url = None
                if item.get('poster_path'):
                    poster_url = f"https://image.tmdb.org/t/p/w500{item['poster_path']}"
                
                movie = Movie(
                    title  = str(item['title']),
                    movies_id = int(item['id']),
                    description = str(item.get('overview', 'No description available')),
                    duration = int(item.get('runtime', 120)),
                    rating = str(round(float(item.get('vote_average', 0)), 1)),  
                    poster_url = poster_url,
                    base_price=round(random.uniform(250.00, 310.00), 2),

                )
                db.session.add(movie)
                count +=1
        
        db.session.commit()
        return jsonify({
            "message": f"Successfully added {count} new movies",
            "total_available": len(data['results'])
        })
    except Exception as e:
        db.session.rollback()
        print(f"Error during sync: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
    

@bp.route('/movies', methods=['GET'])
def get_movies():
    try:
        movies = Movie.query.all()
        # Convert to list of dictionaries
        movies_list = [{
            'id': m.id,
            'title': m.title,
            'movies_id' : m.movies_id,
            'description': m.description,
            'duration': m.duration,
            'rating': m.rating,
            'poster_url': m.poster_url,
            'base_price' : m.base_price,
        } for m in movies]
        return jsonify(movies_list)  # Return as array
    except Exception as e:
        print(f"Error fetching movies: {str(e)}")  # Debug print
        return jsonify({'error': str(e)}), 500
    

@bp.route('/movies/<int:movies_id>', methods=['GET'])
def get_movie(movies_id):
    try:
        movie = Movie.query.filter_by(movies_id=movies_id).first()
        if not movie:
            return jsonify({"error": "Movie not found"}), 404
        
        # session['movieTitle'] = movie.title
        # session.modified=True
        # print(f"Movie Title ", movie.title )

        print("Session data in /movies/<int:movies_id>:", session)
        return jsonify({
            "id": movie.id,
            "movies_id": movie.movies_id,
            "title": movie.title,
            "description": movie.description,
            "duration": movie.duration,
            "rating": movie.rating,
            "poster_url": movie.poster_url
        })
         
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route('/movies/<int:movie_id>/showtime' , methods=['GET'])
def get_Data(movie_id):
    try:
        movie = Movie.query.filter_by(movies_id = movie_id).first()
        if not movie:
            return jsonify({"error" : "Not Movie Id Match"})
        
        ID = movie.id

        showtime = Showtimes.query.filter_by(movie_id = ID).all()

        return jsonify([
            {
            'id' : s.id ,
            'movie_id' : s.movie_id,
            'showtime' : s.showtime,
            'date' : s.date,
            'theater' : s.theater,
            'available_seats': s.available_seats
            } for s in showtime
        ])
        
    except Exception as e:
        return jsonify({"Error" : str(e)}), 500


@bp.route('/movies/<int:movie_id>/showtime/<string:date>' , methods=['GET'])
def get_showtime(movie_id , date):
    try:
        movie = Movie.query.filter_by(movies_id = movie_id).first()
        if not movie:
            return jsonify({"error" : "Not Movie Id Match"})
        
        ID = movie.id

        # showtime = Showtimes.query.filter_by(movie_id = ID).all()
        showtime = Showtimes.query.filter(
            (Showtimes.movie_id == ID) & (Showtimes.date == date)
        ).all()
        
        return jsonify([
            {
            'id' : s.id ,
            'movie_id' : s.movie_id,
            'showtime' : s.showtime,
            'date' : s.date,
            'theater' : s.theater,
            'available_seats': s.available_seats
            } for s in showtime
        ])
    except Exception as e:
        return jsonify({"Error" : str(e)}), 500
    

@bp.route('/generate-showtimes', methods=['POST'])
def generate_showtimes():
    try:
        theaters = ["Cineplex A", "Galaxy Mall", "INOX City Center", "PVR Platinum", "IMAX Infinity"]

        def generate_showtimes_for_movie(movie_id, days=7):
            now = datetime.now()
            showtimes = []
            for day in range(days):
                base_date = (now + timedelta(days=day)).date()
                for hour in [10, 13, 16, 19, 22]:  # 10AM, 1PM, 4PM, 7PM, 10PM
                    # show_time =  timedelta(days=day, hours=(hour - now.hour))
                    full_datetime = datetime.combine(base_date, time(hour=hour)) 
                    showtimes.append(
                        Showtimes(
                            movie_id=movie_id,
                            showtime=full_datetime,
                            date =full_datetime.date(),
                            theater=random.choice(theaters),
                            available_seats=random.randint(50, 150)
                        )
                    )
            return showtimes

        movies = Movie.query.all()
        count = 0
        for movie in movies:
            existing = Showtimes.query.filter_by(movie_id=movie.id).first()
            if not existing:
                showtimes = generate_showtimes_for_movie(movie.id)
                db.session.add_all(showtimes)
                count += len(showtimes)

        db.session.commit()
        return jsonify({"message": f"Successfully added {count} showtimes."}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@bp.route('/save-seats' , methods=['POST'])
def save_seats():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        movie_id = data.get('movie_id')
        showtime_id = data.get('showtime_id')
        movie_title = data.get('movie_title')
        selectedSeats = data.get('selected_seats',[])


        if not all([movie_id , showtime_id , selectedSeats is not None]):
            return jsonify({'Error':'Missing Required Data'}) , 400
        
        session_key = f"movie_{movie_id}_showtime_{showtime_id}_seats"
        session[session_key] = selectedSeats

        if movie_title:
            session['movieTitle'] = movie_title

        return jsonify({'message' : "Seats are Saved Successfully"}) , 200
    
    except Exception as e:
        return jsonify({"Error" : str(e)}) , 500
    


@bp.route('/get-seats' , methods=['GET'])
def get_seats():
    try:
        movie_id = request.args.get('movie_id')
        showtime_id = request.args.get('showtime_id')
        movieTitle = session.get('movieTitle')

        theater = Showtimes.query.filter_by(id = showtime_id).first()
        if not theater:
            return jsonify({"Error" : "theater is not found"})
        
        MTheater= session['MovieTheater'] = theater.theater
        MShowtime=session['MovieShowtime'] = theater.showtime

        print("Session data:", session)

        if not all([movie_id , showtime_id , MTheater , MShowtime is not None]):
            return jsonify({'Error' : "Missing Requirment from the the get"}) , 400
        
        session_key = f"movie_{movie_id}_showtime_{showtime_id}_seats"
        selected_seats = session.get(session_key , [])

        return jsonify({'Selected_seats' : selected_seats,
                         'movie_id' : movie_id,
                         'showtime_id' : showtime_id,
                         'movieTitle' : movieTitle,
                         'theater' : MTheater,
                         'showtime' : MShowtime
                    }) , 200
    
    except Exception as e:
        return jsonify({'Error': str(e)}) , 500
    

@bp.route('/save-tickets' , methods=['POST'])
def save_tickets():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        uid = data.get('user_id')
        movie_id = data.get('movie_id')
        showtime_id = data.get('showtime_id')
        selectedSeats = data.get('selected_seats')
        movieTitle = data.get('movie_title')
        theater = data.get('theater')
        MovieShowtime = data.get('showtime')
        email = data.get('email')

        movie = Movie.query.filter_by(movies_id=movie_id).first()
        if not movie:
            return jsonify({"error": "Movie not found"}), 404
            
        # Calculate total price
        seat_count = len(selectedSeats.split(',')) if isinstance(selectedSeats, str) else len(selectedSeats)
        total_price = seat_count * movie.base_price
        
        # Apply theater premium if needed
        if "IMAX" in theater or "DOLBY" in theater:
            total_price *= 1.2  # 20% premium
            
        # Round to 2 decimal places
        total_price = round(total_price, 2)

        booking = Booking(
            user_id = uid,
            showtime_id=showtime_id,
            movie_id=movie_id,
            theater=theater,
            seats=selectedSeats,
            user_email=email,
            movie_title=movieTitle,
            date=MovieShowtime,
            amount=total_price
        )
        db.session.add(booking)
        db.session.commit()
        return jsonify({"message": "Booking saved successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@bp.route('/movies/<int:movie_id>/showtime/<int:showtime_id>/seats' , methods=['GET'])
def get_BookedSeats( movie_id , showtime_id):
    try:
        showtime =Booking.query.filter_by(showtime_id = showtime_id).all()
        if not showtime:
            return jsonify({"seats": []}), 200
        
        all_booked_seats = []
        for booking in showtime:
            if booking.seats:
                # Assuming seats are stored as comma-separated string
                seats = booking.seats.split(',') if isinstance(booking.seats, str) else booking.seats
                all_booked_seats.extend(seats)
        
        # Remove duplicates and return
        unique_booked_seats = list(set(all_booked_seats))
        return jsonify({
            "seats": unique_booked_seats,
            "movie_id": movie_id,
            "showtime_id": showtime_id
        }), 200
    
    except Exception as e:
        return jsonify({"Error" : str(e)})  , 500
    

@bp.route('/sendEmail' , methods=['POST'])
def send_email():
    try:
        data=request.get_json()
        email = data.get('email')
        if not email:
            return jsonify({"error" : "No data provided"}), 400
        
        otp = str(random.randint(100000 , 999999))
        otp_store[email]= {'otp' : otp , 'timestamp' : time.time()}

        print(f"Generated OTP for {email}: {otp}") 


        msg = Message('Your OTP Code ' , sender=current_app.config['MAIL_DEFAULT_SENDER'] , recipients=[email])
        msg.body = f"Your OTP code is {otp}. It is valid for 5 minutes."
        mail.send(msg)

        return jsonify({"message" : "OTP sent successfully"}), 200
    
    except Exception as e:
        return jsonify({"error" : str(e)}), 500
    
@bp.route('/verifyOtp' , methods=['POST'])
def verifyOtp():
    try:
        data = request.get_json()
        email = data.get('email')
        user_otp = data.get('otp')

        if not email or not user_otp:
            return({"Error" : "Missing Emial or OTP required"}) , 404
        
        entry = otp_store.get(email)
        print(f"Stored OTP for {email}: {entry}")  # Debugging
        if not entry:
            print(f"OTP is", entry)
            return({"verified" : False , "Error" : "OTP NOt found"})
        
        if time.time() - entry['timestamp'] > 300:
            del otp_store[email]
            return({"verified" : False , "Error" : "OTP is Expired"}) , 401
        
        if entry['otp'] == user_otp:
            del otp_store[email]
            return({"verified" : True}) , 200
        else:
            return jsonify({'verified': False}), 401
    
    except Exception as e:
        return({"Error" : str(e)}) , 500



@bp.route('/getBooking/<string:userId>' , methods=['GET'])
def getBooking(userId):
    try:
        bookings = Booking.query.filter_by(user_id=userId).all()
        if not bookings:
            return jsonify({"message": "No bookings found", "bookings": []}), 200
        
        bookings_list = []
        current_time = datetime.now()  # Get current datetime
        
        for booking in bookings:
            # Get movie details
            movie = Movie.query.filter_by(movies_id=booking.movie_id).first()
            showtime = Showtimes.query.filter_by(id=booking.showtime_id).first()            
            booking_datetime = None
            if booking.date and showtime and showtime.showtime:
                booking_datetime = datetime.combine(
                    booking.date, 
                    showtime.showtime.time()
                )
            
            bookings_list.append({
                'booking_id': booking.id,
                'movie': {
                    'id': movie.id if movie else None,
                    'movie_id' : movie.movies_id,
                    'title': booking.movie_title,
                    'poster_url': movie.poster_url if movie else None,
                    'duration': movie.duration if movie else None
                },
                'theater': booking.theater,
                'showtime': {
                    'id': showtime.id if showtime else None,
                    'date': booking.date.isoformat() if booking.date else None,
                    'time': showtime.showtime.time().isoformat() if showtime else None,
                    'datetime': showtime.showtime if booking_datetime else None
                },
                'seats': booking.seats if isinstance(booking.seats, list) else booking.seats.split(','),
                'total_price': booking.amount,  # Assuming $10 per seat
                'status': 'upcoming' if booking_datetime and booking_datetime > current_time else 'completed'
            })

        return jsonify(bookings_list), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# @bp.route('/getBooking/<string:userId>' , methods=['GET'])
# def getBooking(userId):
#     try:
#         bookings = Booking.query.filter_by(user_id = userId).all()
#         if not bookings:
#             return jsonify({"message": "No bookings found", "bookings": []}), 200
        
#         booking_list=[]
#         current_time = datetime.now()  

#         for booking in bookings:

#             movie = Movie.query.filter_by(movies_id = booking.movie_id).first()
#             showtime = Showtimes.query.filter_by(id = booking.showtime_id).first()

#             booking_datetime = None

#             if booking.date and showtime and showtime.showtime:
#                 booking_datetime = datetime.combine(
#                     booking.date,
#                     showtime.showtime.time()
#                 )
#             booking_list.append({
#                 'booking_id' : booking.id,
#                 'movies' : {
#                     'id' : movie.id if movie else None,
#                     'title' : booking.movie_title,
#                     'poster_url' : movie.poster_url,
#                     'duration' : movie.duration 
#                 },
#                 'theater' : booking.theater,
#                 'showtime' : {
#                     'id' : showtime.id if showtime else None,
#                     'date' : booking.date.isoformat() if booking.date else None,
#                     'time' : showtime.showtime.time().isoformat() if showtime else None,
#                     'datetime' : booking_datetime.isoformat() if booking_datetime else None
#                 },
#                 'seats' : booking.seats if isinstance(booking.seats, list) else booking.seats.split(','),
#                 'total-price' : len(booking.seats.split(',')) * 10,
#                 'status' : 'upcoming' if booking_datetime and booking_datetime > current_time else 'completed'
#             })
#         return jsonify({"Error" : " No Bookings Found"}), 404
    
#     except Exception as e:
#         return jsonify({"Error" : str(e)}), 500


