import React, { useState , useEffect } from 'react';
import '../Style/Seats.css'; // If you want, separate CSS
import { useLocation , Link } from 'react-router-dom';
import { FetchBookedSeats } from '../api';

const Seats = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const {state} = useLocation();
  const {movieShow , showtime , OneMovies} = state || {}
  const [bookedSeat , setBookedSeat] = useState([]) 
  

  const seatsPerRow = 20;
  const aisleAfterSeat = 10;

  useEffect(()=>{
    const fetchSavedSeats = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/get-seats?movie_id=${movieShow.id}&showtime_id=${showtime.id}`,
          { credentials: 'include' }  // Important for sessions
        );
        if (res.ok) {
          const data = await res.json();
          setSelectedSeats(data.selected_seats || []);
        } else {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch seats");
        }
      } catch (error) {
        console.error("Error fetching saved seats:", error);
        setSelectedSeats([]);
      }
    };
     fetchSavedSeats()
  } , [movieShow.id , showtime.id])

  console.log(movieShow.id + "and" + showtime.id)

  const sections = [
    { name: 'Regular', rows: ['A', 'B', 'C', 'D'] },
    { name: 'Premium', rows: ['H', 'I', 'J'] },
    { name: 'VIP', rows: ['M', 'N'] }
  ];

  const toggleSeat = async (seatId) => {
    setSelectedSeats(prev => {
      const currentSeats = Array.isArray(prev) ? prev : [];
      const newSeats = currentSeats.includes(seatId)
        ? currentSeats.filter(s => s !== seatId)
        : [...currentSeats, seatId];
      
      // Move API call here to ensure we use the latest state
      saveSeatsToAPI(movieShow.id, showtime.id, newSeats , movieShow.title);
      
      return newSeats;
    });
  };

  useEffect(() => {
    console.log("Current selected seats:", selectedSeats);
    console.log("Price of db,", OneMovies.base_price);
  }, [selectedSeats]);
  
  async function saveSeatsToAPI(movieId, showtimeId, seats , title) {
    try {
      const response = await fetch('http://localhost:5000/api/save-seats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          movie_id: movieId,
          showtime_id: showtimeId,
          selected_seats: seats,
          movie_title: title
        })
      }); 
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to save seats:", errorData);
        throw new Error(errorData.error || "Failed to save seats");
      }
      return await response.json();
    } catch (error) {
      console.error("Error saving seats:", error);
      throw error;
    }
  }

  useEffect(()=>{
    const FetchData = async() =>{
      try{
       const res = await FetchBookedSeats(movieShow.id , showtime.id)
       if(res.ok){
        const data = await res.json();
        setBookedSeat(data.seats)
       }else{
         const errorData = await res.json()
         console.error(errorData || "Faild To Fetch")
       }
      }catch(error){
        console.error(error.message);
      } 
    }
    FetchData()
  } ,[movieShow.id , showtime.id])

  console.log(bookedSeat)

  const renderSeat = (rowLetter, seatNum, sectionName) => {
    const seatId = `${rowLetter}${seatNum}`; // Generates like "N20"
    
    // Normalize both the generated seatId and booked seats for comparison
    const normalizedSeatId = seatId.trim().toUpperCase();
     const isBooked = bookedSeat.some(seat =>{
        const normalizedBooked =  String(seat).trim().toUpperCase();
        return normalizedBooked === normalizedSeatId;
     })

    const isVip = sectionName === 'VIP';
    const isSelected = selectedSeats.includes(seatId);

    return (
        <div
            key={seatId}
            className={`seat ${isBooked ? 'booked' : 'available'} ${isVip ? 'vip' : ''} ${isSelected ? 'selected' : ''}`}
            data-seat={seatId}
            onClick={() => !isBooked && toggleSeat(seatId)}
        >
            {seatNum}
        </div>
    );
};

  return (
    <div className="container Seats">
      <div className="screen my-4">Movie Screen</div>

      <div className="seating-area">
        {sections.map((section) => (
          <div key={section.name} className="section">
            <div className=" text-left">{section.name} Section</div>
            {section.rows.map((rowLetter) => (
              <div key={rowLetter} className="row">
                <div className="row-label">{rowLetter}</div>
                {[...Array(seatsPerRow)].map((_, index) => (
                  <>
                    {index === aisleAfterSeat && (
                      <div key={`${rowLetter}-aisle-${index}`} className="seat aisle"></div>
                    )}
                    {renderSeat(rowLetter, index + 1, section.name)}
                  </>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#28a745' }}></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#007bff' }}></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ffc107' }}></div>
          <span>VIP</span>
        </div>
      </div>

      <div className="checkout">
        <div className="selected-count">
          {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
          {selectedSeats.length > 0 && (
            <div>
              <strong>: {selectedSeats.join(', ')}</strong>
              <div>Total: ₹{(selectedSeats.length * (OneMovies.base_price || 500)).toFixed(2)}</div>
            </div>
          )}
        </div>
        <Link
          to={`/movies/${movieShow.id}/showtime/${showtime.id}/seats/payment`}
          className="btn btn-lg btn-success mt-3"
          disabled={selectedSeats.length === 0}
          state={{movieShow , showtime , OneMovies}}
        >
          Confirm Selection
        </Link>
      </div>
    </div>
  );
};

export default Seats;
