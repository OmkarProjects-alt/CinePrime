import React, { useState, useEffect } from 'react';
import '../Style/Payment.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../Authentication/firebase';
import { FaFilm, FaCalendarAlt, FaMapMarkerAlt, FaChair, FaCreditCard, FaLock } from 'react-icons/fa';
import { MdEmail, MdPayment } from 'react-icons/md';

export default function Payment(props) {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { movieShow, showtime , OneMovies } = state || {};
    const [email, setEmail] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const [sessionData, setSessionData] = useState({
        selected_seats: [],
        movieTitle: '',
        movie_id: '',
        showtime: '',
        showtime_id: '',
        theater: ''
    });

    if (!movieShow?.id || !showtime?.id) {
        navigate('/MovieList');
    }

    useEffect(() => {
        async function FetchData() {
            try {
                const res = await fetch(`http://localhost:5000/api/get-seats?movie_id=${movieShow.id}&showtime_id=${showtime.id}`, { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setSessionData({
                        selected_seats: data.Selected_seats || [],
                        movieTitle: data.movieTitle,
                        movie_id: data.movie_id,
                        showtime: data.showtime,
                        showtime_id: data.showtime_id,
                        theater: data.theater || ''
                    });
                } else {
                    const errorData = await res.json();
                    throw new Error("Failed to Fetch session" || errorData);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        FetchData();
        if (auth.currentUser?.email) {
            setEmail(auth.currentUser.email);
        }
    }, [movieShow?.id, showtime?.id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        
        try {
            const res = await fetch(`http://localhost:5000/api/save-tickets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    user_id: auth.currentUser.uid,
                    movie_id: movieShow.id,
                    showtime_id: showtime.id,
                    selected_seats: sessionData.selected_seats.join(', '),
                    movie_title: sessionData.movieTitle,
                    theater: sessionData.theater,
                    showtime: sessionData.showtime,
                    email: email,
                    genres: movieShow.genres.map((genre) => genre.name).join(', '),
                })
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                console.log(errorData);
                throw new Error(errorData.error || "Failed to Post The data");
            }
            
            await res.json();
            setPaymentSuccess(true);
            setTimeout(() => {
                navigate('/'); // Redirect to confirmation page
            }, 2000);
        } catch (error) {
            console.error(error.message);
            alert('Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        
        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const formatExpiryDate = (value) => {
        const v = value.replace(/[^0-9]/g, '');
        if (v.length >= 3) {
            return `${v.slice(0, 2)}/${v.slice(2)}`;
        }
        return value;
    };

    const formattedDate = (data) => {
        if (!data) return '';
        const date = new Date(data);
        const options = {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return date.toLocaleString('en-US', options);
    };

    // Update the calculateTotal function
        const calculateTotal = () => {
            const convenienceFee = 50;
            const subtotal = sessionData.selected_seats.length * (OneMovies.base_price || 500); // Fallback to 500 if no price
            return {
                subtotal,
                convenienceFee,
                total: subtotal + convenienceFee
            };
        };

    const totals = calculateTotal();

    if (paymentSuccess) {
        return (
            <div className="payment-success-container">
                <div className="payment-success-card">
                    <div className="success-animation">
                        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                        </svg>
                    </div>
                    <h2>Payment Successful!</h2>
                    <p>Your tickets have been booked successfully.</p>
                    <p>An email confirmation has been sent to {email}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-container mt-5">
            <div className="payment-header">
                <h1>Complete Your Booking</h1>
                <p>Secure payment - Your information is protected</p>
            </div>

            <div className={`payment-content`}>
                <div className={`payment-form-container ${props.dark === 'dark' ? 'dark-theme-payment' :''}`}>
                    <div className={`payment-card`}>
                        <h2><FaCreditCard /> Payment Details</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email"><MdEmail /> Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-input"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="cardNumber"><MdPayment /> Card Number</label>
                                <input
                                    type="text"
                                    id="cardNumber"
                                    className="form-input"
                                    placeholder="1234 5678 9012 3456"
                                    value={formatCardNumber(cardNumber)}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    maxLength="19"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="expiryDate">Expiry Date</label>
                                    <input
                                        type="text"
                                        id="expiryDate"
                                        className="form-input"
                                        placeholder="MM/YY"
                                        value={formatExpiryDate(expiryDate)}
                                        onChange={(e) => setExpiryDate(e.target.value)}
                                        maxLength="5"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="cvv">CVV</label>
                                    <input
                                        type="password"
                                        id="cvv"
                                        className="form-input"
                                        placeholder="123"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)}
                                        maxLength="3"
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="submit-btn" disabled={isProcessing}>
                                {isProcessing ? 'Processing...' : `Pay Rs. ${totals.total}`}
                            </button>

                            <div className="security-info">
                                <FaLock /> Your payment is secured with 256-bit encryption
                            </div>
                        </form>
                    </div>
                </div>

                <div className={`order-summary-container ${props.dark === 'dark' ? 'dark-theme-payment' :''}`}>
                    <div className={`order-summary-card`}>
                        <h2>Order Summary</h2>
                        
                        <div className="movie-info">
                            <div className="movie-title">
                                <FaFilm /> {sessionData.movieTitle || 'Movie Title'}
                            </div>
                            
                            <div className="movie-detail">
                                <FaMapMarkerAlt /> {sessionData.theater || 'Theater Name'}
                            </div>
                            
                            <div className="movie-detail">
                                <FaCalendarAlt /> {formattedDate(sessionData.showtime) || 'Showtime'}
                            </div>
                            
                            <div className="movie-detail">
                                <FaChair /> Seats: {sessionData.selected_seats.join(', ') || 'No seats selected'}
                            </div>
                        </div>

                        <div className="price-breakdown">
                            <div className="price-row">
                                <span>Tickets ({sessionData.selected_seats.length} x Rs. {OneMovies.base_price})</span>
                                <span>Rs. {totals.subtotal}</span>
                            </div>
                            
                            <div className="price-row">
                                <span>Convenience Fee</span>
                                <span>Rs. {totals.convenienceFee}</span>
                            </div>
                            
                            <div className="price-row total">
                                <span>Total Amount</span>
                                <span>Rs. {totals.total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}