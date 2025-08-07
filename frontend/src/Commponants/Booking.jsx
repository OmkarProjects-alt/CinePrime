import React, { useState, useEffect, useContext } from 'react';
import '../Style/Booking.css';
import { FetchUserBookingData } from '../api';
import { auth } from '../Authentication/firebase';
import { Link, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MoviesContext } from './MoviesContext';
import { FaTicketAlt, FaFilm, FaTheaterMasks, FaCalendarAlt, FaClock, FaMoneyBillWave, FaChair } from 'react-icons/fa';

export default function Booking(props) {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [toggleMovieData, setToggleMovieData] = useState([]);
    const { state } = useLocation();
    const { movies } = useContext(MoviesContext);
    const [activeFilter, setActiveFilter] = useState('all');

    // Enhanced animations with GSAP
useGSAP(() => {
    if (loading || !toggleMovieData.length) return;
    gsap.fromTo(".stats-box",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.2)", delay: 0.3 }
    );
    gsap.fromTo(".booking-card",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.6 }
    );
    return () => {
        gsap.set(".stats-box", { clearProps: "all" });
        gsap.set(".booking-card", { clearProps: "all" });
    };
}, [loading, toggleMovieData.length]);

    // Modal animation
    useEffect(() => {
        const modal = document.getElementById('ticketModal');
        if (modal) {
            modal.addEventListener('show.bs.modal', () => {
                gsap.from(".modal-content", {
                    y: 100,
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                });
            });
        }
    }, []);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                if (!auth.currentUser?.uid) {
                    throw new Error('User is not authenticated');
                }

                const data = await FetchUserBookingData(auth.currentUser.uid);
                if (!Array.isArray(data)) {
                    throw new Error('Unexpected data format');
                }
                const reversedData = data.reverse();
                setBookings(reversedData);
                setToggleMovieData(reversedData);
            } catch (err) {
                console.error(err.message);
                setError(err.message || 'Failed to load bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const formattedDate = (data) => {
        const date = new Date(data);
        return date.toLocaleString('en-US', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const formattedTime = (data) => {
        const hour = Math.floor(data / 60);
        const minutes = Math.floor(data % 60);
        return `${hour}h ${minutes > 0 ? `${minutes}m` : ''}`.trim();
    };

    const getBookingStatus = (date) => {
        const now = new Date();
        const bookingDate = new Date(date);
        now.setHours(0, 0, 0, 0);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate.getTime() > now.getTime() ? 'Upcoming' : 'Completed';
    };

    const filterBookings = (filter) => {
        setActiveFilter(filter);
        switch (filter) {
            case 'upcoming':
                setToggleMovieData(bookings.filter(booking => booking.status === 'upcoming'));
                break;
            case 'completed':
                setToggleMovieData(bookings.filter(booking => booking.status === 'completed'));
                break;
            default:
                setToggleMovieData([...bookings]);
        }
    };

    return (
        <div className={`booking-container ${props.dark === 'dark' ? 'dark-theme' : ''}`}>
            <div className="booking-header">
                <h2 className="booking-title">My Movie Tickets</h2>
                <p className="booking-subtitle">Your cinematic journey at a glance</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-container">
                <div className="stats-box total-bookings">
                    <div className="stats-icon">
                        <FaTicketAlt />
                    </div>
                    <div className="stats-content">
                        <h6>Total Bookings</h6>
                        <p className="stats-value">{bookings.length}</p>
                    </div>
                </div>

                <div className="stats-box upcoming-bookings">
                    <div className="stats-icon">
                        <FaCalendarAlt />
                    </div>
                    <div className="stats-content">
                        <h6>Upcoming</h6>
                        <p className="stats-value">
                            {bookings.filter(booking => booking.status === 'upcoming').length}
                        </p>
                    </div>
                </div>

                <div className="stats-box money-spent">
                    <div className="stats-icon">
                        <FaMoneyBillWave />
                    </div>
                    <div className="stats-content">
                        <h6>Money Spent</h6>
                        <p className="stats-value">
                            ₹{bookings.reduce((sum, booking) => sum + Number(booking.total_price), 0)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter Controls */}
            <div className="filter-controls">
                <button 
                    className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => filterBookings('all')}
                >
                    <i className="bi bi-list-task"></i> All Bookings
                </button>
                <div className="btn-group">
                    <button 
                        type="button" 
                        className="filter-btn dropdown-toggle" 
                        data-bs-toggle="dropdown" 
                        aria-expanded="false"
                    >
                        <i className="bi bi-funnel-fill"></i> Status: {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
                    </button>
                    <ul className="dropdown-menu">
                        <li><button className="dropdown-item" onClick={() => filterBookings('all')}>All</button></li>
                        <li><button className="dropdown-item" onClick={() => filterBookings('upcoming')}>Upcoming</button></li>
                        <li><button className="dropdown-item" onClick={() => filterBookings('completed')}>Completed</button></li>
                    </ul>
                </div>
            </div>

            {/* Booking Cards */}
            {loading ? (
                <div className="loading-spinner">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="error-message alert alert-danger">{error}</div>
            ) : toggleMovieData.length === 0 ? (
                <div className="no-bookings">
                    <img src="https://cdn.dribbble.com/users/5107895/screenshots/14532312/media/a7e6c2e9333d0989e3a54c95dd8321d7.gif" alt="No bookings" />
                    <h4>No bookings found</h4>
                    <Link to="/" className="btn btn-primary">
                        Book a Movie Now
                    </Link>
                </div>
            ) : (
                <div className="booking-cards-container">
                    {toggleMovieData.map((booking, index) => (
                        <div className={`booking-card ${getBookingStatus(booking.showtime.date).toLowerCase()}`} key={booking.id}>
                            <div className="movie-poster">
                                <img src={booking.movie.poster_url} alt={booking.movie.title} />
                                <div className="movie-overlay">
                                    <span className={`status-badge ${getBookingStatus(booking.showtime.date).toLowerCase()}`}>
                                        {getBookingStatus(booking.showtime.date)}
                                    </span>
                                </div>
                            </div>

                            <div className="booking-details">
                                <div className="movie-header">
                                    <h3 className="movie-title">{booking.movie.title}</h3>
                                    <div className="movie-runtime">
                                        <FaClock /> {formattedTime(booking.movie.duration)}
                                    </div>
                                </div>

                                <div className="booking-info-grid">
                                    <div className="info-item">
                                        <FaTheaterMasks className="info-icon" />
                                        <div>
                                            <p className="info-label">Theater</p>
                                            <p className="info-value">{booking.theater}</p>
                                        </div>
                                    </div>

                                    <div className="info-item">
                                        <FaCalendarAlt className="info-icon" />
                                        <div>
                                            <p className="info-label">Date & Time</p>
                                            <p className="info-value">{formattedDate(booking.showtime.datetime)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="seats-section">
                                    <p className="seats-label">
                                        <FaChair className="me-2" /> Your Seats
                                    </p>
                                    <div className="seats-container">
                                        {booking.seats.map((seat) => (
                                            <span className="seat-badge" key={seat}>{seat}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="booking-footer">
                                    <div className="total-price">
                                        ₹{booking.total_price}
                                    </div>
                                    {booking.status === 'upcoming' ? (
                                        <button
                                            type="button"
                                            className="ticket-btn"
                                            data-bs-toggle="modal"
                                            data-bs-target="#ticketModal"
                                            onClick={() => setSelectedBooking(booking)}
                                        >
                                            <FaTicketAlt className="me-2" />
                                            View Ticket
                                        </button>
                                    ) : (
                                        <Link 
                                            className="book-again-btn" 
                                            to={`/movies/${booking.movie.movie_id}`} 
                                            state={{ movies: movies }}
                                        >
                                            <FaFilm className="me-2" />
                                            Book Again
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Ticket Modal */}
            <div className="modal fade" style={{opacity:1}} id="ticketModal" tabIndex="-1" aria-labelledby="ticketModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content ticket-modal-content" style={{ opacity:7 }}>
                        {selectedBooking ? (
                            <>
                                <div className="ticket-modal-header">
                                    <h2 className="ticket-modal-title">
                                        <FaTicketAlt className="me-2" />
                                        Your Movie Ticket
                                    </h2>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                
                                <div className="ticket-modal-body">
                                    <div className="ticket-poster">
                                        <img src={selectedBooking.movie.poster_url} alt={selectedBooking.movie.title} />
                                    </div>
                                    
                                    <div className="ticket-details">
                                        <div className="ticket-movie-title">{selectedBooking.movie.title}</div>
                                        
                                        <div className="ticket-info-item">
                                            <FaTheaterMasks className="ticket-icon" />
                                            <span>{selectedBooking.theater}</span>
                                        </div>
                                        
                                        <div className="ticket-info-item">
                                            <FaCalendarAlt className="ticket-icon" />
                                            <span>{formattedDate(selectedBooking.showtime.datetime)}</span>
                                        </div>
                                        
                                        <div className="ticket-seats">
                                            <div className="ticket-seats-label">
                                                <FaChair className="me-2" />
                                                Your Seats:
                                            </div>
                                            <div className="ticket-seats-badges">
                                                {selectedBooking.seats.map(seat => (
                                                    <span key={seat} className="ticket-seat-badge">{seat}</span>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="ticket-barcode">
                                            <div className="barcode"></div>
                                            <div className="ticket-number">{selectedBooking.id}</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="ticket-modal-footer">
                                    <p className="ticket-note">
                                        Please arrive at least 30 minutes before showtime with this ticket
                                    </p>
                                    <button 
                                        type="button" 
                                        className="btn btn-primary print-btn"
                                        onClick={() => window.print()}
                                    >
                                        Print Ticket
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="loading-ticket">Loading ticket details...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}