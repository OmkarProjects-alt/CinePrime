import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams , useLocation } from 'react-router-dom';
import { fetchActorDetail, fetchMovieDetail, FetchDB , fetchTrailer, AllMovie } from '../api';
import Loading from './Loading';
import '../Style/ShowMovieDetails.css';
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);


export default function ShowMovieDetails(props) {
  const [movieD, setMovieD] = useState([]);
  const [movieDcrew , setMovieDcrew] = useState([]) 
  const [movieShow, setMovieShow] = useState(null);
  const [loading , setLoading] = useState(true);
  const [movieDetail, setMovieDetail] = useState([]);
  const {state} = useLocation()
  const {movies = []} = state || []
  const { id } = useParams();
  const [currentSlideCast, setCurrentSlideCast] = useState(0);
  const [currentSlideCrew, setCurrentSlideCrew] = useState(0);
  const [movieTrailerURL , setMovieTrailerURL ] = useState('');
  const [Trailer , setTrailer] = useState(false)
  const castSliderRef = useRef(null);
  const crewSliderRef = useRef(null);
  const visibleActors = 5;
  const visibleCrew = 5;
  const SlideRef = useRef()
  const CastContainerRef = useRef()
  const CrewContainerRef = useRef()
  const [related , setRelated] = useState([]);
  const [Movies , setMovies] = useState([]);
  const [match , setMatch] = useState([])
  const [showBtn , setShowBtn] = useState()
  const [error , setError] = useState(null)

  useGSAP(()=>{
    if(!SlideRef.current) return

    if(loading) return

    gsap.set(SlideRef.current, {
         opacity:0,
         y:5,
         x:1000,
    })

    const t = gsap.timeline({ defaults: { ease: 'power3.in' } });
  
    t.to(SlideRef.current , {
        opacity:1,
        x:0,
        y:0,
        ease:'power3.out',
        duration:1.4,
        delay:0.5,
    })

  },[ loading , id , movieDetail ])



  useGSAP(() => {
    if (loading || !CastContainerRef.current || !CrewContainerRef.current || !movieD || !movieDcrew ||loading ) return;
  
    gsap.set([CastContainerRef.current, CrewContainerRef.current], {
      x: -1000,
      opacity: 0,
    });
  
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  
    if (CastContainerRef.current) {
      tl.to(CastContainerRef.current, {
        x: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: CastContainerRef.current,
          start: 'top 80%',
          end: 'bottom 60%',
          scrub: true,
        }
      });
    }
  
    if (CrewContainerRef.current) {
      tl.to(CrewContainerRef.current, {
        x: 0,
        opacity: 10,
        duration: 1,
        scrollTrigger: {
          trigger: CrewContainerRef.current,
          start: 'top 80%',
          end: 'bottom 100%',
          scrub: true,
        }
      }, "+=0.5");
    }
  
  }, { dependencies: [ loading , movieD, movieDcrew] });



  useEffect(() => {
    function LoadAllMovie(){
      try{
        AllMovie()
        .then((res) => res.json())
        .then((data) => {
          setMovies(data.results || []);
        })
      }catch(err){
        console.error("Error fetching all movies:", err);
      }
    }
    LoadAllMovie();
  } , [])


  useEffect(() => {
    async function LoadFetch() {
      try {
        const movieD = await fetchActorDetail(id);
        const movieDcrew = await fetchActorDetail(id);
        const filteredActors = Array.isArray(movieD) 
          ? movieD.filter(actor => actor.profile_path)
          : movieD.cast 
            ? movieD.cast.filter(actor => actor.profile_path)
            : [];

        const filterdCrew = Array.isArray(movieDcrew)
          ? movieDcrew.filter(crew => crew.profile_path)
          : movieDcrew.crew 
             ? movieDcrew.crew.filter(crew => crew.profile_path)
             : [];

        setMovieDcrew(filterdCrew)
        setMovieD(filteredActors);
      } catch (error) {
        console.log("Error Fetching Data ", error);
      }
    }
    LoadFetch();
  }, [id]);


  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchMovieDetail(id),
      FetchDB(id)
    ])
    .then(([movieShowData, movieDetailData]) => {
      setMovieShow(movieShowData);
      setMovieDetail(movieDetailData);
      setLoading(false);
    })
    .catch(error => {
      console.error(error);
      setLoading(false);
    });
  },[id]);


  
    useEffect(() => {
      if (!movieShow || !movieShow.genres || !Array.isArray(movieShow.genres)) return;
      const MovieGener = movieShow.genres.map((gen) =>  gen.id);
      if (MovieGener.length === 0) setError('Related Movie Not Found') ;

      const relatedMovies = Movies.filter((movie) => {
        if (movie.id === movies.movies_id) return false;
        if (!movie.genre_ids || !Array.isArray(movie.genre_ids)) return false;
        
        return movie.genre_ids.some((movieGen) => {
          const genreId = movieGen;
          return MovieGener.includes(genreId);
        });
      });
       
      setRelated(relatedMovies);
    
    }, [movieShow, Movies]);


    useEffect(() => {
      if(!related || related.length === 0) return;

      const getId = related.map((movie) => movie.id);

      const matchId = movies.filter((movie) =>{
 
        if(!movie || !movie.movies_id) return false;


        return getId.includes(movie.movies_id);

      })
    if (JSON.stringify(matchId) !== JSON.stringify(match)) {
      setMatch(matchId);
    }
    },[related, movies]);

    useEffect(() => {
       if(!movies || !movieShow || !movieDetail) return;

       const ID = movieDetail.movies_id;
       console.log(movies)
       const MatchId = movies.some((movie) => {
  
        return movie.movies_id === ID
       });


    })


  const handleNextCast = () => {
    if (currentSlideCast < movieD.length - visibleActors) {
      setCurrentSlideCast(prev => prev + 1);
    }
  };

  const handlePrevCast = () => {
    if (currentSlideCast > 0) {
      setCurrentSlideCast(prev => prev - 1);
    }
  };

  const handleNextCrew = () => {
    if (currentSlideCrew < movieDcrew.length - visibleCrew) {
      setCurrentSlideCrew(prev => prev + 1);
    }
  };
  
  const handlePrevCrew = () => {
    if (currentSlideCrew > 0) {
      setCurrentSlideCrew(prev => prev - 1);
    }
  };

  const showTrailer = async(id) =>{
      try{
            setTrailer(true)
             const res = await fetchTrailer(id)
             if(res.ok){
                const data = await res.json();
                const trailer = data.results.find((vid)=> vid.type ==='Trailer' && vid.site === 'YouTube')
                if(trailer){
                    setMovieTrailerURL(`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&controls=1&showinfo=0&modestbranding=1`)
                }
             }
           }catch(err){
              console.log(err.message)
           }
  }

     const placeholderArray = Array(4).fill(0)

  useEffect(() => {
    if (castSliderRef.current) {
      const slideWidth = 15;
      const gap = 5; 
      const translateX = -currentSlideCast * (slideWidth + gap);
      castSliderRef.current.style.transform = `translateX(${translateX}vmin)`;
    }
  }, [currentSlideCast, movieD ]);

  useEffect(() => {
    if (crewSliderRef.current) {
      const slideWidth = 15;
      const gap = 5;
      const translateX = -currentSlideCrew * (slideWidth + gap);
      crewSliderRef.current.style.transform = `translateX(${translateX}vmin)`;
    }
  }, [currentSlideCrew]);

  const Time = (time) => {
    const h = Math.floor(time / 60);
    const m = Math.floor(time % 60);
    return `${h}h ${m > 0 ? `${m}m` : ''}`.trim();
  };

  if (loading) {
      return <Loading />;
  }

  const randomVotes = Math.floor(Math.random() * 50 + 1);
  console.log(movies , "my movies")

  return (
    <div className='ShowDetaile' key={id}>
      <div className='dashboard'>
      {movieDetail && (
        <>
          <div className='backImg position-absolute top-0 end-0 ' style={{backgroundImage: `url(https://image.tmdb.org/t/p/original${movieShow.backdrop_path})`  , minHeight:'0vh' }}></div>
            <div className='card-movie' ref={SlideRef}>
              <div className='poster'>
                <div className="card mx-7 my-4" style={{ width: "40vmin", height: "60vmin", marginLeft: "30vmin", marginTop: '2vmin' }}>
                  <img src={movieDetail.poster_url ? movieDetail.poster_url : `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`} className="card-img-top" alt={movieDetail.title} />
                </div>
              </div>
              <div className='detail my-5 mx-5'>
                <p className='title'>{movieDetail.title}</p>
                <div className='d-flex p-1'>
                  {movieShow.genres.map((gener , index ) => (
                    <div key={index} className='border border-1  rounded-5 fs-6 d-inline-block text-center px-1 py-1 mx-1 '> 
                        <p className='fw-lighter text-center mx-1 '>{gener.name}</p>
                    </div>
                  ))}
                </div>
                <div className='Rate d-flex justify-content-center align-items-center my-3'>
                  <p style={{ fontSize: '4vmin' }} className=''>
                    ⭐{movieDetail.rating ? movieDetail.rating : movieDetail.vote_average }/10 ({randomVotes}K Votes)  
                    <button className='mx-4 btn btn-light btR'>Rate Now</button>
                  </p>
                </div>
                <div className='my-3'>
                  <button className='btn btn-light mx-1 btD'>2D</button>
                    {movieShow.spoken_languages.map((language, index) => (
                      <button key={index} className='btn btn-light mx-1 btR'>
                        {language.english_name}
                      </button>
                    ))}

                </div>
                <p>{Time(movieDetail.duration ? movieDetail.duration : movieDetail.runtime )}</p>

                <div className=''>
                
                  {movies && movies.map((movie) => {
                    if (movie.movies_id === movieDetail.movies_id || movie.movies_id === movieShow.id) {
                      return (
                        <Link
                          key={movie.movies_id}
                          className="btn btn-danger btn-transform fw-bold mx-1 me-3 my-2 fs-5"
                          style={{ height: "6vmin", width: "25vmin" }}
                          to={`/movies/${movie.movies_id}/showtime`}
                          state={{ movieShow: movieShow , OneMovies: movie }}
                        >
                          Book Now
                        </Link>
                      );
                    }
                    return null; 
                  })}

                  <button onClick={()=>showTrailer( movieShow.id ||movieDetail.movies_id)} style={{height:'6vmin' , width:'25vmin'}} className='btn btn-light btn-transform text-center fs-5'><i className="bi bi-play-fill "></i>Play Trailer</button>
                </div>
              </div>
            </div>
        </>
      )}
      </div>

      <div className='About container my-4'>

         <strong className={`text-${props.dark==='light' ? 'dark' : 'light'}`}>About The Movie</strong>
         <p className={`text-${props.dark==='light' ? 'dark' : 'light'}`}>{movieDetail.description ? movieDetail.description : movieDetail.overview }</p>
      </div>

      <div className='cast-display-container' ref={CastContainerRef}>
        <strong className='cast'>Cast</strong>
        {movieD.length > 0 ? (
          <div className='cast-navigation-container'>
            <button 
              className={`nav-button prev ${currentSlideCast ===0 ? 'invisible' : null}`}
              onClick={handlePrevCast}
            >
              &lt;
            </button>
            
            <div className='cast-slider-container'>
              <div className='cast-slider' ref={castSliderRef}>
                {movieD ? movieD.map((actor) => (
                  <div key={actor.id} className='cast-slide text-center'>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                      alt={actor.name}
                      onError={(e) => e.target.style.display = 'none'}
                    /> 
                    <p className={`actor-name text-${props.dark==='light' ? 'dark' : 'light'}`}>{actor.original_name}</p>
                    <p className={`character	text-${props.dark==='light' ? 'dark' : 'light'}`}>{actor.character}</p>
                  </div>
                )):<p>Waite for some time</p>}
              </div>
            </div>

            <button 
              className={`nav-button next ${currentSlideCast >= movieD.length - visibleActors ? 'invisible' : null}`}
              onClick={handleNextCast}
            >
              &gt;
            </button>
          </div>
        ) : (
          <p>No cast images available</p>
        )}
      </div>


      <div className='cast-display-container' ref={CrewContainerRef}>
        <strong className='cast'>Crew</strong>
        {movieDcrew.length > 0 ? (
          <div className='cast-navigation-container'>
            <button
              className={`nav-button prev ${currentSlideCrew === 0 ? 'invisible' : null } `}
              onClick={handlePrevCrew}
            >
              &lt;
            </button>
            
            <div className='cast-slider-container'>
              <div className='cast-slider' ref={crewSliderRef}>
                {movieDcrew.map((actor) => (
                  <div key={actor.cast_id} className='cast-slide text-center'>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                      alt={actor.name}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <p className='actor-name'>{actor.original_name}</p>
                    <p className='department'>{actor.department}</p>
                  </div>
                ))}
              </div>
            </div>

            <button 
              className={`nav-button next ${currentSlideCrew >= movieDcrew.length - visibleCrew ? 'invisible' : null}`}
              onClick={handleNextCrew}
            >
              &gt;
            </button>
          </div>
        ) : (
          <div className=''><Loading/></div>
        )}
      </div>
        {Trailer && (
            <div className='trailer-container'>
                <div className='trailer'>
                <button 
                    className='btn position-absolute top-0 end-0 m-2' 
                    onClick={() => setTrailer(false)}
                    style={{zIndex: 1001}}
                >
                    ❌
                </button>
                <div className="h-100 w-100 d-flex align-items-center justify-content-center">
                    {!movieTrailerURL ? (
                    <div className="text-center">
                        <Loading />
                        <p className="text-white mt-3">Loading trailer...</p>
                    </div>
                    ) : (
                    <iframe 
                        src={movieTrailerURL} 
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
            
            <div className='container'>
               <div className=''>
                  <h3>Related Movies</h3>
                  <div className='related-Container'>
                     {match.length > 0 ? (
                      <div>
                        <div className='d-flex gap-4'>
                          {match.map(movie => (
                            <div className=''>
                              <div key={movie.id} className="highGrind-item ">
                                {(
                                  <img src={movie.poster_url} alt={movie.title} className="grid-poster" />
                                )}
                                <div className="grid-details">
                                  <h3 className='font'>{movie.title}</h3>
                                  <div className="grid-meta">
                                    <span>
                                      {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                                    </span>
                                  </div>
                                    <Link to={`/movies/${movie.movies_id}`} state={{ movies: movies }} className='btn btn-primary'>More</Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ):
                     ( error === null ? 
                      <div className=' d-flex gap-2'>
                            {placeholderArray.map((_,index)=>(
                                <div key={index} className=''>
                                    <div className="card p-3 bg-dark" aria-hidden="true">
                                        <div className='' style={{backgroundColor:'#6c757d' , height: '40vmin', width: '35vmin'}}></div>
                                        <div className="card-body w-50">
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
                                            <button className="btn btn-primary disabled placeholder mt-2 col-6" aria-disabled="true"></button>
                                        </div>
                                    </div>
                                </div>
                                ))}
                        </div>
                     : <div className='text-center my-5 fs-1'>{error}</div> )
                    }
                  </div>
               </div>
            </div>
    </div>
  );
}
