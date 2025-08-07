// // // import React, { useState, useEffect , useRef } from 'react';
// // // import { useParams, useLocation , Link } from 'react-router-dom';
// // // import { FetchShowtime ,SeeData } from '../api';
// // // import Loading from './Loading';
// // // import '../Style/ShowTime.css';
// // // import { useGSAP } from '@gsap/react';
// // // import gsap from 'gsap';
// // // import { SplitText } from 'gsap/SplitText';
// // // import { ScrollTrigger } from 'gsap/ScrollTrigger';

// // // gsap.registerPlugin(ScrollTrigger)

// // // gsap.registerPlugin(SplitText);

// // // export default function ShowTime() {
// // //   const { state } = useLocation();
// // //   const { movieShow } = state || {};
// // //   const [showtimes, setShowtimes] = useState([]);
// // //   const [showtimeDate , setShowTimeDate] = useState([])
// // //   // const [filteredShowtimes, setFilteredShowtimes] = useState([]);
// // //   const [selectedDate, setSelectedDate] = useState('2025-04-26');
// // //   const [loading, setLoading] = useState(true);
// // //   const [clicked ,setClicked] = useState(false)
// // //   const [error, setError] = useState(null);
// // //   const { id } = useParams();
// // //   const TextRef = useRef()
// // //   const SliedRef = useRef()


// // //   // useGSAP(()=>{
// // //   //     gsap.set('.text-container',{opacity:1})
// // //   //     let split = new SplitText(TextRef.current,{type:'words' , opacity:0,})
 
// // //   //     gsap.to(split.words,{
// // //   //      opacity:1,
// // //   //      duration:2,
// // //   //      ease:"sine.out",
// // //   //      stagger:0.2,
// // //   //     })
// // //   // },{dependencies :[ showtimeDate]})

 
// // //   useGSAP(() => {
// // //     // Target the date cards specifically
// // //     const boxes = gsap.utils.toArray('.date-card');
    
// // //     if (boxes.length === 0) return; // Exit if no elements found
  
// // //     gsap.killTweensOf(boxes);
  
// // //     gsap.to(boxes , {
// // //       keyframes: {
// // //         y: [0, 20, -10, 10, 0],
// // //         ease: "none", 
// // //         easeEach: "power2.inOut" 
// // //       },
// // //       ease: "elastic",
// // //       duration: 5,
// // //       stagger: 0.2
// // //     });
    
    
// // //   }, { dependencies: [showtimeDate] });

// // //   useGSAP(()=>{
// // //      const slieds = gsap.utils.toArray('.theater-card')

// // //      if (slieds.length === 0) return;
// // //      console.log(slieds.length)

// // //      slieds.forEach(slied => {
// // //          gsap.set(slied , {
// // //             x:-9000,
// // //             opacity:-5,
// // //          })
// // //          gsap.to(slied , {
// // //            x:0,
// // //            opacity:1,
// // //            duration:500,
// // //            delay:37,
// // //            scrollTrigger : {
// // //              trigger:slied,
// // //              start: 'top 85%',
// // //               end: 'bottom 100%',
// // //               scrub: true,
// // //               markers:true
// // //            }
// // //          })
// // //      })
// // //   } ,[showtimeDate])

// // //   // Generate dates for the next 7 days
// // //   const generateDates = () => {
// // //     const dates = [];
// // //     const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
// // //     const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
// // //     for (let i = 0; i < 7; i++) {
// // //       const date = new Date();
// // //       date.setDate(date.getDate() + i);
// // //       dates.push({
// // //         day: days[date.getDay()],
// // //         date: date.getDate(),
// // //         month: months[date.getMonth()],
// // //         fullDate: date.toISOString().split('T')[0] // YYYY-MM-DD format
// // //       });
// // //     }
// // //     return dates;
// // //   };

// // //   const dates = generateDates();

// // //   // Fetch all showtimes on component mount
// // //   useEffect(() => {
// // //     async function loadShowtimes() {
// // //       try {
// // //         const data = await SeeData(id);
// // //         setShowtimes(data);
// // //         setLoading(false);
// // //       } catch (err) {
// // //         setError(err.message);
// // //         setLoading(false);
// // //       }
// // //     }
// // //     loadShowtimes();
// // //   }, [id]);

// // //   useEffect(()=>{
// // //       async function LoadDate(){
// // //         try{
// // //           const res = await FetchShowtime(id , selectedDate)
// // //           setShowTimeDate(res)
// // //         }catch(err){
// // //           setError(err.message);
// // //         }
// // //       }
// // //       LoadDate();
// // //   },[id ,selectedDate])



// // //   const SetData = (Time) => {
// // //     setSelectedDate(Time)
// // //     setClicked(true)
// // //   }
// // //   // Filter showtimes when date is selected
// // //   useEffect(() => {
// // //     if (selectedDate && showtimes.length > 0) {
// // //       const filtered = showtimes.filter(
// // //         showtime => showtime.date === selectedDate
// // //       );
// // //       // setFilteredShowtimes(filtered);
// // //       console.log(filtered)
// // //     }
// // //   }, [selectedDate, showtimes]);


// // //    if(!showtimeDate || !showtimes){
// // //     return <div><Loading/></div>
// // //    }


// // //   // Format time for display
// // //   const formatTime = (timeString) => {
// // //     const time = new Date(timeString);
// // //     return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // //   };

// // //   if (loading) return <Loading />;
// // //   if (error) return <div className="error">Error: {error}</div>;

// // //   return (
// // //     <div style={{marginTop:'15vmin'}}>
// // //     <div className="container">
// // //       <div className="">
// // //         <h2 className="fs-1 mt-3">{movieShow.title}</h2>
// // //         <div className="mb-4 ">
// // //           {movieShow?.genres?.map((genre, index) => (
// // //             <span key={index} className="border border-1 rounded-4 p-1 p-md-1 genre">{genre.name}</span>
// // //           ))}
// // //         </div>
// // //       </div>
// // //      </div>
    

// // //     {/* Date Selection */}
// // //     <div>
// // //       <div className='vertical-divider'>
// // //         <div className="container my-3">
// // //           <div className="date-selector">
// // //             {dates.map((dateObj) => (
// // //               <div
// // //                 key={dateObj.fullDate}
// // //                 className={`date-card ${selectedDate === dateObj.fullDate ? 'active' : ''} my-1 box`}
// // //                 onClick={() => SetData(dateObj.fullDate)}
// // //               >
// // //                 <div className="day">{dateObj.day}</div>
// // //                 <div className="date">{dateObj.date}</div>
// // //                 <div className="month">{dateObj.month}</div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       </div>
// // //         <div className='text-container'>
// // //             <p className={` ${clicked ? 'hide' : ''} text-center text-danger`}  ref={TextRef}>*Please First Select the Date as You Preferred </p>
// // //         </div>
// // //     </div>
    
// // //       <div className='back'>
// // //         {/* Showtimes Display */}
// // //         <div className='container '>
// // //             <div className="theater-list " >
// // //               {showtimeDate.map((showtime) => (
// // //                   <div key={showtime.id} className="theater-card my-3"  ref={SliedRef}>
// // //                     <div className="container">
// // //                       <div className='row'>
// // //                         <div className="theater-name col ">{showtime.theater}</div>
// // //                         <div className='d-flex  col'>
// // //                           <Link to={`/movies/${movieShow.id}/showtime/${showtime.id}/seats`} className="btn btn-danger " state={{movieShow , showtime}}>{formatTime(showtime.showtime)}</Link>
// // //                         </div>
// // //                       </ div>
// // //                     </div>
// // //                   <div className="theater-features">
// // //                     <span className="feature">M-Ticket</span>
// // //                     <span className="feature">Food & Beverage</span>
// // //                     {showtime.theater.includes('MovieMax') && (
// // //                       <span className="feature">DOLBY 7.1</span>
// // //                     )}
// // //                   </div>
                  
// // //                   <div className="showtime-info">
// // //                     <span className="cancellation">Cancellation available</span>
// // //                   </div>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //   );
// // // }


// // import React, { useState, useEffect, useRef } from 'react';
// // import { useParams, useLocation, Link } from 'react-router-dom';
// // import { FetchShowtime, SeeData } from '../api';
// // import Loading from './Loading';
// // import '../Style/ShowTime.css';
// // import { useGSAP } from '@gsap/react';
// // import gsap from 'gsap';
// // import { SplitText } from 'gsap/SplitText';
// // import { ScrollTrigger } from 'gsap/ScrollTrigger';
// // import { FaTicketAlt, FaCalendarAlt, FaClock, FaFilm, FaTheaterMasks, FaChair, FaDollarSign, FaUtensils } from 'react-icons/fa';

// // gsap.registerPlugin(ScrollTrigger, SplitText);

// // export default function ShowTime() {
// //   const { state } = useLocation();
// //   const { movieShow } = state || {};
// //   const [showtimes, setShowtimes] = useState([]);
// //   const [showtimeDate, setShowTimeDate] = useState([]);
// //   const [selectedDate, setSelectedDate] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const [clicked, setClicked] = useState(false);
// //   const [error, setError] = useState(null);
// //   const { id } = useParams();
// //   const TextRef = useRef();
// //   const containerRef = useRef();

// //   // Generate dates for the next 7 days with enhanced formatting
// //   const generateDates = () => {
// //     const dates = [];
// //     const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// //     const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
// //     for (let i = 0; i < 7; i++) {
// //       const date = new Date();
// //       date.setDate(date.getDate() + i);
// //       dates.push({
// //         day: days[date.getDay()],
// //         date: date.getDate(),
// //         month: months[date.getMonth()],
// //         fullDate: date.toISOString().split('T')[0],
// //         isToday: i === 0
// //       });
// //     }
// //     return dates;
// //   };

// //   const dates = generateDates();

// //   // Animation for date cards
// //   useGSAP(() => {
// //     const dateCards = gsap.utils.toArray('.date-card');
    
// //     dateCards.forEach((card, i) => {
// //       gsap.from(card, {
// //         y: 50,
// //         opacity: 0,
// //         duration: 0.6,
// //         delay: i * 0.1,
// //         ease: "back.out(1.7)",
// //       });
// //     });
// //   }, [dates]);

// //   // Animation for theater cards
// //   useGSAP(() => {
// //     const theaterCards = gsap.utils.toArray('.theater-card');
    
// //     theaterCards.forEach((card, i) => {
// //       gsap.from(card, {
// //         x: -100,
// //         opacity: 0,
// //         duration: 0.8,
// //         delay: i * 0.15,
// //         ease: "power3.out",
// //         scrollTrigger: {
// //           trigger: card,
// //           start: "top 80%",
// //           toggleActions: "play none none none"
// //         }
// //       });
// //     });
// //   }, [showtimeDate]);

// //   // Fetch all showtimes on component mount
// //   useEffect(() => {
// //     async function loadShowtimes() {
// //       try {
// //         const data = await SeeData(id);
// //         setShowtimes(data);
// //         setLoading(false);
// //         // Set initial date to today
// //         const today = new Date().toISOString().split('T')[0];
// //         setSelectedDate(today);
// //       } catch (err) {
// //         setError(err.message);
// //         setLoading(false);
// //       }
// //     }
// //     loadShowtimes();
// //   }, [id]);

// //   // Fetch showtimes for selected date
// //   useEffect(() => {
// //     async function LoadDate() {
// //       try {
// //         if (selectedDate) {
// //           const res = await FetchShowtime(id, selectedDate);
// //           setShowTimeDate(res);
// //           setClicked(true);
// //         }
// //       } catch (err) {
// //         setError(err.message);
// //       }
// //     }
// //     LoadDate();
// //   }, [id, selectedDate]);

// //   const SetData = (Time) => {
// //     setSelectedDate(Time);
// //     setClicked(true);
// //   };

// //   // Format time for display
// //   const formatTime = (timeString) => {
// //     const time = new Date(timeString);
// //     return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// //   };

// //   if (loading) return <Loading />;
// //   if (error) return <div className="error-message">Error: {error}</div>;

// //   return (
// //     <div className="showtime-page" ref={containerRef}>
// //       {/* Movie Header */}
// //       <div className="movie-header-container">
// //         <div className="container">
// //           <h1 className="movie-title">{movieShow.title}</h1>
// //           <div className="genres-container">
// //             {movieShow?.genres?.map((genre, index) => (
// //               <span key={index} className="genre-badge">
// //                 {genre.name}
// //               </span>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Date Selection */}
// //       <div className="date-selector-container">
// //         <div className="container">
// //           <h3 className="section-title">
// //             <FaCalendarAlt className="me-2" />
// //             Select Date
// //           </h3>
// //           <div className="date-selector">
// //             {dates.map((dateObj) => (
// //               <div
// //                 key={dateObj.fullDate}
// //                 className={`date-card ${selectedDate === dateObj.fullDate ? 'active' : ''} ${dateObj.isToday ? 'today' : ''}`}
// //                 onClick={() => SetData(dateObj.fullDate)}
// //               >
// //                 <div className="day">{dateObj.day.substring(0, 3)}</div>
// //                 <div className="date">{dateObj.date}</div>
// //                 <div className="month">{dateObj.month.substring(0, 3)}</div>
// //                 {dateObj.isToday && <div className="today-badge">Today</div>}
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Showtimes Section */}
// //       <div className="showtimes-container">
// //         <div className="container">
// //           {!clicked ? (
// //             <div className="select-date-prompt" ref={TextRef}>
// //               <FaClock className="prompt-icon" />
// //               <p>Please select a date to view available showtimes</p>
// //             </div>
// //           ) : showtimeDate.length === 0 ? (
// //             <div className="no-showtimes">
// //               <FaFilm className="no-showtimes-icon" />
// //               <h4>No showtimes available for this date</h4>
// //               <p>Please try another date</p>
// //             </div>
// //           ) : (
// //             <>
// //               <h3 className="section-title">
// //                 <FaTheaterMasks className="me-2" />
// //                 Available Theaters
// //               </h3>
// //               <div className="theater-list">
// //                 {showtimeDate.map((showtime) => (
// //                   <div key={showtime.id} className="theater-card">
// //                     <div className="theater-header">
// //                       <h4 className="theater-name">
// //                         <FaTicketAlt className="me-2" />
// //                         {showtime.theater}
// //                       </h4>
// //                       <Link
// //                         to={`/movies/${movieShow.id}/showtime/${showtime.id}/seats`}
// //                         className="showtime-btn"
// //                         state={{ movieShow, showtime }}
// //                       >
// //                         {formatTime(showtime.showtime)}
// //                       </Link>
// //                     </div>

// //                     <div className="theater-features">
// //                       <span className="feature">
// //                         <FaTicketAlt className="me-1" /> M-Ticket
// //                       </span>
// //                       <span className="feature">
// //                         <FaUtensils className="me-1" /> Food & Beverage
// //                       </span>
// //                       {showtime.theater.includes('MovieMax') && (
// //                         <span className="feature premium">
// //                           <FaFilm className="me-1" /> DOLBY 7.1
// //                         </span>
// //                       )}
// //                     </div>

// //                     <div className="theater-footer">
// //                       <span className="cancellation">
// //                         <FaDollarSign className="me-1" /> Free cancellation available
// //                       </span>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }




// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useLocation, Link } from 'react-router-dom';
// import { FetchShowtime, SeeData } from '../api';
// import Loading from './Loading';
// import '../Style/ShowTime.css';
// import { useGSAP } from '@gsap/react';
// import gsap from 'gsap';
// import { SplitText } from 'gsap/SplitText';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { FaTicketAlt, FaCalendarAlt, FaClock, FaFilm, FaTheaterMasks, FaChair, FaDollarSign, FaUtensils } from 'react-icons/fa';

// gsap.registerPlugin(ScrollTrigger, SplitText);

// export default function ShowTime(props) {
//   const { state } = useLocation();
//   const { movieShow } = state || {};
//   const [showtimes, setShowtimes] = useState([]);
//   const [showtimeDate, setShowTimeDate] = useState([]);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [clicked, setClicked] = useState(false);
//   const [error, setError] = useState(null);
//   const { id } = useParams();
//   const TextRef = useRef();
//   const containerRef = useRef();

//   // Generate dates for the next 7 days with enhanced formatting
//   const generateDates = () => {
//     const dates = [];
//     const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//     const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
//     for (let i = 0; i < 7; i++) {
//       const date = new Date();
//       date.setDate(date.getDate() + i);
//       dates.push({
//         day: days[date.getDay()],
//         date: date.getDate(),
//         month: months[date.getMonth()],
//         fullDate: date.toISOString().split('T')[0],
//         isToday: i === 0
//       });
//     }
//     return dates;
//   };

//   const dates = generateDates();

//   // Animation for date cards
//   useGSAP(() => {
//     const dateCards = gsap.utils.toArray('.date-card');
    
//     dateCards.forEach((card, i) => {
//       gsap.from(card, {
//         y: 50,
//         opacity: 0,
//         duration: 0.6,
//         delay: i * 0.1,
//         ease: "back.out(1.7)",
//       });
//     });
//   }, [dates]);

//   // Animation for theater cards
//   useGSAP(() => {
//     const theaterCards = gsap.utils.toArray('.theater-card');
    
//     theaterCards.forEach((card, i) => {
//       gsap.from(card, {
//         x: -100,
//         opacity: 0,
//         duration: 0.8,
//         delay: i * 0.15,
//         ease: "power3.out",
//         scrollTrigger: {
//           trigger: card,
//           start: "top 80%",
//           toggleActions: "play none none none"
//         }
//       });
//     });
//   }, [showtimeDate]);

//   // Fetch all showtimes on component mount
//   useEffect(() => {
//     async function loadShowtimes() {
//       try {
//         const data = await SeeData(id);
//         setShowtimes(data);
//         setLoading(false);
//         // Set initial date to today
//         const today = new Date().toISOString().split('T')[0];
//         setSelectedDate(today);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     }
//     loadShowtimes();
//   }, [id]);

//   // Fetch showtimes for selected date
//   useEffect(() => {
//     async function LoadDate() {
//       try {
//         if (selectedDate) {
//           const res = await FetchShowtime(id, selectedDate);
//           setShowTimeDate(res);
//           setClicked(true);
//         }
//       } catch (err) {
//         setError(err.message);
//       }
//     }
//     LoadDate();
//   }, [id, selectedDate]);

//   const SetData = (Time) => {
//     setSelectedDate(Time);
//     setClicked(true);
//   };

//   // Format time for display
//   const formatTime = (timeString) => {
//     const time = new Date(timeString);
//     return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   if (loading) return <Loading />;
//   if (error) return <div className="error-message">Error: {error}</div>;

//   return (
//     <div className={`showtime-page ${props.dark === 'dark' ? 'dark-theme' : ''}`} ref={containerRef}>
//       {/* Movie Header */}
//       <div className="movie-header-container">
//         <div className="container">
//           <h1 className="movie-title">{movieShow.title}</h1>
//           <div className="genres-container">
//             {movieShow?.genres?.map((genre, index) => (
//               <span key={index} className="genre-badge">
//                 {genre.name}
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Date Selection */}
//       <div className="date-selector-container">
//         <div className="container">
//           <h3 className="section-title">
//             <FaCalendarAlt className="me-2" />
//             Select Date
//           </h3>
//           <div className="date-selector">
//             {dates.map((dateObj) => (
//               <div
//                 key={dateObj.fullDate}
//                 className={`date-card ${selectedDate === dateObj.fullDate ? 'active' : ''} ${dateObj.isToday ? 'today' : ''}`}
//                 onClick={() => SetData(dateObj.fullDate)}
//               >
//                 <div className="day">{dateObj.day.substring(0, 3)}</div>
//                 <div className="date">{dateObj.date}</div>
//                 <div className="month">{dateObj.month.substring(0, 3)}</div>
//                 {dateObj.isToday && <div className="today-badge">Today</div>}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Showtimes Section */}
//       <div className="showtimes-container">
//         <div className="container">
//           {!clicked ? (
//             <div className="select-date-prompt" ref={TextRef}>
//               <FaClock className="prompt-icon" />
//               <p>Please select a date to view available showtimes</p>
//             </div>
//           ) : showtimeDate.length === 0 ? (
//             <div className="no-showtimes">
//               <FaFilm className="no-showtimes-icon" />
//               <h4>No showtimes available for this date</h4>
//               <p>Please try another date</p>
//             </div>
//           ) : (
//             <>
//               <h3 className="section-title">
//                 <FaTheaterMasks className="me-2" />
//                 Available Theaters
//               </h3>
//               <div className="theater-list">
//                 {showtimeDate.map((showtime) => (
//                   <div key={showtime.id} className="theater-card">
//                     <div className="theater-header">
//                       <h4 className="theater-name">
//                         <FaTicketAlt className="me-2" />
//                         {showtime.theater}
//                       </h4>
//                       <Link
//                         to={`/movies/${movieShow.id}/showtime/${showtime.id}/seats`}
//                         className="showtime-btn"
//                         state={{ movieShow, showtime }}
//                       >
//                         {formatTime(showtime.showtime)}
//                       </Link>
//                     </div>

//                     <div className="theater-features">
//                       <span className="feature">
//                         <FaTicketAlt className="me-1" /> M-Ticket
//                       </span>
//                       <span className="feature">
//                         <FaUtensils className="me-1" /> Food & Beverage
//                       </span>
//                       {showtime.theater.includes('MovieMax') && (
//                         <span className="feature premium">
//                           <FaFilm className="me-1" /> DOLBY 7.1
//                         </span>
//                       )}
//                     </div>

//                     <div className="theater-footer">
//                       <span className="cancellation">
//                         <FaDollarSign className="me-1" /> Free cancellation available
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }





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

// Register GSAP plugins
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

  // Generate dates for the next 7 days
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

  // Animation for date cards
 useGSAP(() => {
    // Target the date cards specifically
    const boxes = gsap.utils.toArray('.date-card');
    
    if (boxes.length === 0) return; // Exit if no elements found
  
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

  // Animation for theater cards
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

  // Fetch all showtimes on component mount
  useEffect(() => {
    async function loadShowtimes() {
      try {
        const data = await SeeData(id);
        setShowtimes(data);
        setLoading(false);
        // Set initial date to today
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    loadShowtimes();
  }, [id]);

  // Fetch showtimes for selected date
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

  // Format time for display
  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <Loading />;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className={`showtime-page ${props.dark === 'dark' ? 'dark-theme' : ''}`} ref={containerRef}>
      {/* Movie Header */}
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

      {/* Date Selection */}
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

      {/* Showtimes Section */}
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