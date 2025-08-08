import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { FetchShowtime, SeeData } from '../api';
import Loading from './Loading';
import '../Style/ShowTime.css';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaTicketAlt, FaCalendarAlt, FaClock, FaFilm, FaTheaterMasks, FaDollarSign, FaUtensils } from 'react-icons/fa';
import { IoMdPopcorn } from 'react-icons/io';

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function ShowTime(props) {
  const { state } = useLocation();
  const { movieShow , OneMovies } = state || {};
  const [showtimes, setShowtimes] = useState([]);
  const [showtimeDate, setShowTimeDate] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const containerRef = useRef();

  const generateDates = () => {
    const dates = [];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        day: days[date.getDay()],
        date: date.getDate(),
        month: months[date.getMonth()],
        fullDate: date.toISOString().split('T')[0],
        isToday: i === 0
      });
    }
    return dates;
  };

  const dates = generateDates();

 useGSAP(() => {
    const boxes = gsap.utils.toArray('.date-card');
    
    if (boxes.length === 0) return; 
  
    gsap.killTweensOf(boxes);
  
    gsap.to(boxes , {
      keyframes: {
        y: [0, 20, -10, 10, 0],
        ease: "none", 
        easeEach: "power2.inOut" 
      },
      ease: "elastic",
      duration: 5,
      stagger: 0.2
    });
  }, { dependencies: [showtimeDate] });

  useGSAP(() => {
    const theaterCards = gsap.utils.toArray('.theater-card');
    
    theaterCards.forEach((card, i) => {
      gsap.from(card, {
        x: -100,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });
    });
  }, [showtimeDate]);

  useEffect(() => {
    async function loadShowtimes() {
      try {
        const data = await SeeData(id);
        setShowtimes(data);
        setLoading(false);
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    loadShowtimes();
  }, [id]);

  useEffect(() => {
    async function LoadDate() {
      try {
        if (selectedDate) {
          const res = await FetchShowtime(id, selectedDate);
          setShowTimeDate(res);
          setClicked(true);
        }
      } catch (err) {
        setError(err.message);
      }
    }
    LoadDate();
  }, [id, selectedDate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setClicked(true);
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <Loading />;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className={`showtime-page ${props.dark === 'dark' ? 'dark-theme' : ''}`} ref={containerRef}>
      <div className={`movie-header-container ${props.dark === 'dark' ? 'dark-theme' : ''}`}>
        <div className="container">
          <h1 className="movie-title">{movieShow.title}</h1>
          <div className="genres-container">
            {movieShow?.genres?.map((genre, index) => (
              <span key={index} className="genre-badge">
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={`date-selector-container ${props.dark === 'dark' ? 'bg-dark' : ''}`}>
        <div className="container">
          <h3 className={`section-title-showtime ${props.dark === 'dark' ? 'text-light' : ''}`}>
            <FaCalendarAlt className={`me-2 ${props.dark === 'dark' ? 'text-light' : ''}`} />
            Select Date
          </h3>
          <div className="date-selector">
            {dates.map((dateObj) => (
              <div
                key={dateObj.fullDate}
                className={`date-card ${selectedDate === dateObj.fullDate ? 'active' : ''} ${dateObj.isToday ? 'today' : ''} text-primary`}
                onClick={() => handleDateSelect(dateObj.fullDate)}
              >
                <div className="day">{dateObj.day.substring(0, 3)}</div>
                <div className="date">{dateObj.date}</div>
                <div className="month">{dateObj.month.substring(0, 3)}</div>
                {dateObj.isToday && <div className="today-badge">Today</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`showtimes-container ${props.dark === 'dark' ? 'bg-dark' : ''}`}>
        <div className="container">
          {!clicked ? (
            <div className="select-date-prompt">
              <FaClock className="prompt-icon" />
              <p>Please select a date to view available showtimes</p>
            </div>
          ) : showtimeDate.length === 0 ? (
            <div className="no-showtimes">
              <FaFilm className="no-showtimes-icon" />
              <h4>No showtimes available for this date</h4>
              <p>Please try another date</p>
            </div>
          ) : (
            <>
              <h3 className="section-title-showtime">
                <FaTheaterMasks className="me-2" />
                Available Theaters
              </h3>
              <div className="theater-list">
                {showtimeDate.map((showtime) => (
                  <div key={showtime.id} className={`theater-card ${props.dark === 'dark' ? 'dark-theme' : ''}`}>
                    <div className="theater-header">
                      <h4 className="theater-name">
                        <FaTicketAlt className="me-2" />
                        {showtime.theater}
                      </h4>
                      <Link
                        to={`/movies/${movieShow.id}/showtime/${showtime.id}/seats`}
                        className="showtime-btn"
                        state={{ movieShow, showtime , OneMovies }}
                      >
                        {formatTime(showtime.showtime)}
                      </Link>
                    </div>

                    <div className="theater-features">
                      <span className="feature">
                        <FaTicketAlt className="me-1" /> M-Ticket
                      </span>
                      <span className="feature">
                        <FaUtensils className="me-1" /> Food & Beverage
                      </span>
                      {showtime.theater.includes('MovieMax') && (
                        <span className="feature premium">
                          <FaFilm className="me-1" /> DOLBY 7.1
                        </span>
                      )}
                    </div>

                    <div className="theater-footer">
                      <span className="cancellation">
                        <FaDollarSign className="me-1" /> Free cancellation available
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
