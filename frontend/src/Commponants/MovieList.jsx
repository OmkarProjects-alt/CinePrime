import React, { useState, useEffect , useRef} from 'react';
import { fetchMovie , upcomingMovie , fetchTrailer } from '../api';
import '../Style/MovieList.css';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import { useContext } from 'react';
import { MoviesContext } from './MoviesContext';

export default function MovieList() {
    const { movies, setMovies } = useContext(MoviesContext);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [upComing , setUpComing ] = useState([]);
    const [trailerURL , setTrailerURL] = useState('')
    const [showMovieTrailer , setShowMovieTrailer] = useState(false)
    const [displayUpcoming , setDisplayedUpComing] = useState(5) 
    const movieFlex = useRef()
    const [BgImg , setBgImg ] = useState([]);
    const [highRated , setHighRated] = useState([]);
    const [rating, setRating] = useState({});
    const [loading, setLoading] = useState(false);




    useEffect(()=>{
       const loadUpComingMovie = async() => {
             try{
                const res = await upcomingMovie();
                if(res.ok){
                    const data = await res.json()
                    setUpComing(data.results)
 
                    if(data.results.length > 0){
                        setBgImg(data.results[0].backdrop_path)
                    }
                }
             }catch(err){
                console.log(err.message)
             }
        }
       loadUpComingMovie()
    } , [])

       useEffect(()=>{
      async function fetchRating(){
         const ratings = {}
         for(const movie of movies){
            try{
                const res = await fetch(`https://www.omdbapi.com/?apikey=4755f991&t=${movie.title}`);
                const data = await res.json();
                ratings[movie.id]= data.imdbRating || 'N/A';

            }catch(err){
             console.error('Rating not found' , err)
            }
         }
         setRating(ratings)
      }
      if(movies.length > 0 ) fetchRating();
   } , [movies])

       useEffect(() => {
        if(movieFlex.current){
        const gap = 20;
        const card = 300;
        const totalWidth = (gap + card) * displayUpcoming
        movieFlex.current.style.width = `${totalWidth}px`
        }
    } , [displayUpcoming ])


  const topPicks = movies.slice(0, 5);
    const currentMovie = topPicks[currentIndex];


        useEffect(() => {
            async function loadMovie() {
                setLoading(true); // Start loading
                try {
                    const response = await fetchMovie();
                    const newMovies = Array.isArray(response) ? response : response.movies || [];
                    setMovies(newMovies);
                } catch (error) {
                    console.error('Error fetching movies:', error);
                } finally {
                    setLoading(false); // End loading
                }
            }
            loadMovie();
        }, []);

        console.log(loading)

    useEffect(() => {
        setLoading(true);
        try{
            const filtered = movies.filter(movie => {
            const rate = parseFloat(rating[movie.id]);
            return !isNaN(rate) && rate > 7.5;
        });
        setHighRated(filtered);
        setLoading(false);
        }catch(err){
            console.error('Error filtering high rated movies:', err);
        }finally{
            setLoading(false);
        }
    }, [movies, rating]);


    const showTrailer = async(id) =>{
        console.log(id)
        try{
        setShowMovieTrailer(true)
         const res = await fetchTrailer(id)
        //  console.log(res)
         if(res.ok){
            const data = await res.json();
            // console.log(data)
            const trailer = data.results.find((vid)=> vid.type ==='Trailer' && vid.site === 'YouTube')
            if(trailer){
                setTrailerURL(`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&controls=1&showinfo=0&modestbranding=1`)
            }
        }
    }catch(err){
        console.log(err.message)
    }
}

  const StateChange = () => {
    setTrailerURL('')
    setShowMovieTrailer(false)
  }


    useEffect(() => {
        if (movies.length > 1) {
            const interval = setInterval(() => {
                setIsAnimating(true);
                setTimeout(() => {
                    setCurrentIndex((prev) => (prev + 1) % 5); // limit to 5
          
                    setIsAnimating(false);
                }, 500);
            }, 5000);
    
            return () => clearInterval(interval);
        }
    }, [movies]);

    if (movies.length === 0) return <div className="loading"><Loading /></div>;


   const placeholderArray = Array(4).fill(0)



return (
    <div>
        <div className="movie-app my-5 mt-5">
            {/* Single Row Movie Dashboard */}
            <div className={`movie-dashboard ${isAnimating ? 'fade' : ''}`}>
                <div className="movie-card">
                    <div className="movie-poster-container">
                        {currentMovie.poster_url ? (
                            <img src={currentMovie.poster_url} alt={currentMovie.title} />
                        ) : (
                            <div className="no-poster">No Image</div>
                        )}
                    </div>
                    <div className="movie-details">
                        <h2>{currentMovie.title}</h2>
                        <div className="movie-rating">
                            <span className="rating-value">{currentMovie.rating}/10  ★</span>
                            <span className="vote-count">
                                ({Math.floor(Math.random() * 50) + 1}K Votes)
                            </span>
                            <button className="rate-button">Rate now</button>
                        </div>
                        <div className="movie-meta">
                            <span className="format">2D</span>
                            <span className="language">{currentMovie.language || 'Hindi'}</span>
                            <span className="duration">
                                {Math.floor(currentMovie.duration / 60)}h {currentMovie.duration % 60}m
                            </span>
                            <span className="certificate">UA</span>
                        </div>
                        <Link to={`/movies/${currentMovie.movies_id}`} state={{ movies: movies }} className='book-button'>More</Link>
                        <div className="in-cinemas">
                            <svg className="clock-icon" viewBox="0 0 24 24">
                                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            In cinemas
                        </div>
                    </div>
                </div>
            </div>

            {/* Regular Movie Grid */}
            <div className='movie-scroll'>
                <div className="movie-grid" ref={movieFlex}>
                    {movies.slice(0 , displayUpcoming).map((movie, i) => (
                        <div key={movie.id} className="grid-item">
                            {movie.poster_url && (
                                <img src={movie.poster_url} alt={movie.title} className="grid-poster" />
                            )}
                            <div className="grid-details">
                                <h3 className='font'>{movie.title}</h3>
                                <div className="grid-meta">
                                    <span>{rating[movie.id] || 'N/A'}/10</span>
                                    <span>
                                        {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                                    </span>
                                </div>
                                <Link to={`/movies/${movie.movies_id}`} state={{ movies: movies }} className='btn btn-primary'>More</Link>
                            </div>
                        </div>
                    ))}
                {displayUpcoming < movies.length && (
                    <div className='btn-load '>
                        <button className='btn btn-primary load-more-btn' onClick={()=> setDisplayedUpComing(prev => prev+5)}><i className="bi bi-arrow-clockwise"></i></button>
                    </div>
                )
                 }
                </div>
            </div>
        </div>
        <div className='leatest-Trailer bg-img' 
                style={{backgroundImage: BgImg ? `url(https://image.tmdb.org/t/p/original${BgImg})` : '' , minHeight: '50vh' }}>
            <div className='container'>
                <h2 className='text-white text-center py-4' style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
                Upcoming Movies
                </h2>
                <div className='d-flex'>
                {upComing.map((up) => (
                    <div key={up.id} className='card-container p-3 text-center'>
                        <div className="card video-thumbnail-container position-relative" style={{width: "25rem", height: '13rem'}}>
                            <img
                            onClick={()=>showTrailer(up.id)} 
                            src={`https://image.tmdb.org/t/p/w355_and_h200_multi_faces/${up?.poster_path ? up.poster_path : up.backdrop_path || up.backdrop_path}`} 
                            onMouseEnter={() => setBgImg(up.backdrop_path || up.poster_path)}
                            className="card-img-top" 
                            alt={up.title}
                            style={{width: '100%', height: '', objectFit: 'fill'}}
                            />
                            <i className="bi bi-play-fill position-absolute play" onClick={()=>setShowMovieTrailer(true)}></i>
                            
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">{up.title}</h5>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>

        {/* high rated movie */}
         <div className='container'>
            <h2 className='text-dark'>High Rated Movie</h2>
            <div className='movie-scroll'>
                <div className='movie-scroll'>
                    <div className='rated-grid'>
                        {highRated.length > 0 ? ( highRated.map((movie) => (
                            <div className=''>
                                <div key={movie.id} className="highGrind-item">
                                    {movie.poster_url && (
                                        <img src={movie.poster_url} alt={movie.title} className="grid-poster" />
                                    )}
                                    <div className="grid-details">
                                        <h3 className='font'>{movie.title}</h3>
                                        <div className="grid-meta">
                                            <span>{rating[movie.id]}/10</span>
                                            <span>
                                                {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                                            </span>
                                        </div>
                                        <Link to={`/movies/${movie.movies_id}`} state={{ movies: movies }} className='btn btn-primary'>More</Link>
                                    </div>
                                </div>
                            </div>
                        ))) : (

                        <div className=' d-flex gap-2'>
                            {placeholderArray.map((_,index)=>(
                                <div key={index} className=''>
                                    <div className="card p-3 bg-dark" aria-hidden="true">
                                        {/* <img src="..." className="card-img-top" alt="..."/> */}
                                        <div className='placeholder-glow'>
                                            <div className='placeholder' style={{backgroundColor:'#6c757d' , height: '40vmin', width: '35vmin'}}></div>
                                        </div>
                                        <div className="card-body  w-50">
                                            <h5 className="card-title text-light placeholder-glow">
                                                <span className="placeholder col-12"></span>
                                            </h5>
                                            <p className="card-text text-light w-25 placeholder-glow">
                                                <span className="placeholder col-12"></span>
                                                <span className="placeholder col-12"></span>
                                                <span className="placeholder col-12"></span>
                                                <span className="placeholder col-12"></span>
                                                <span className="placeholder col-12"></span>
                                                <span className="placeholder col-12"></span>
                                                <span className="placeholder col-12"></span>
                                                <span className="placeholder col-12"></span>
                                            </p>
                                            <div className='placeholder-glow'>
                                                <button className="btn btn-primary disabled placeholder mt-2 col-9" aria-disabled="true"></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                ))}
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

       {showMovieTrailer && (
            <div className='trailer-container'>
                <div className='trailer'>
                <button
                    aria-label="Close trailer" 
                    className='btn position-absolute top-0 end-0 m-2' 
                    onClick={StateChange}
                    style={{zIndex: 1001}}
                >
                    ❌
                </button>
                <div className="h-100 w-100 d-flex align-items-center justify-content-center">
                    {!trailerURL ? (
                    <div className="text-center">
                        <Loading />
                        <p className="text-white mt-3">Loading trailer...</p>
                    </div>
                    ) : (
                    <iframe 
                        src={trailerURL} 
                        className="h-100 w-100"
                        allow='autoplay; encrypted-media'
                        allowFullScreen
                        title='Trailer'
                        frameBorder="0"
                    />
                    )}
                </div>
                </div>
            </div>
            )}
    </div>
 );
}
