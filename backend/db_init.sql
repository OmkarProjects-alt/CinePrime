-- Active: 1742649735451@@localhost@5433@MovieTicket

CREATE TABLE movie (
    id SERIAL PRIMARY KEY,
    movies_id INT UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT,
    rating VARCHAR(10),
    poster_url VARCHAR(255)
);

CREATE Table MovieActor(
    id SERIAL PRIMARY KEY,
    movie_actor_id INT REFERENCES movie(movies_id) ON DELETE CASCADE,
    actor_img_url VARCHAR(255)
);

CREATE TABLE showtimes (
    id SERIAL PRIMARY KEY,
    movie_id INT REFERENCES movie(id) ON DELETE CASCADE,
    showtime TIMESTAMP NOT NULL,
    date DATE NOT NULL,
    theater VARCHAR(50) NOT NULL,
    available_seats INT NOT NULL
);

CREATE TABLE booking(
    user_id VARCHAR(70) ,
    id SERIAL PRIMARY KEY,
    showtime_id INT REFERENCES showtimes(id),
    movie_id INT REFERENCES movie(movies_id),
    theater VARCHAR(50) NOT NULL,
    seats VARCHAR(250) NOT NULL,
    user_email VARCHAR(100),
    date DATE NOT NULL,
    movie_title VARCHAR(255) NOT NULL,
    amount INT
);

SELECT * FROM movie;

DELETE FROM movie;

DROP TABLE booking;

SELECT id, movies_id, title FROM movie;


ALTER TABLE movie ADD COLUMN base_price DECIMAL(10, 2) DEFAULT 10.00;