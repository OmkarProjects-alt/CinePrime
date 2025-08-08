
import React , {useRef} from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FetchSearchMovie } from '../api';
import { useState, useEffect } from 'react';
import Loading from './Loading';
import '../Style/NavBar.css';
import { auth } from '../Authentication/firebase';
import { useAuth } from '../Authentication/AuthContext';
import moviePoster from '../IMG/Default.jpg'
import  CinePrimeBg from '../IMG/CinePrimeBg.png'

export default function NavBar(props) {
  const [getSearchMovie, setSearchMovie] = useState([]);
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);
  const { logout } = useAuth()

  const user = auth.currentUser; 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const Change = (event) => {
    setSearch(event.target.value);
    setShowResults(true); // Show results when typing
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (getSearchMovie.length > 0) {
        // Navigate to the first movie's page
        navigate(`/movies/${getSearchMovie[0].id}`);
      } else {
        console.log("No movies found");
      }
    }
  };

  const LoadMovie = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
  
    try {
      const res = await FetchSearchMovie(search);
      if (res.ok) {
        const data = await res.json();
        
        const exactMatch = data.results.filter(movie => 
          movie.title.toLowerCase() === search.toLowerCase()
        );
  
        const startsWithMatches = exactMatch.length === 0 
          ? data.results.filter(movie => 
              movie.title.toLowerCase().startsWith(search.toLowerCase())
            )
          : [];
  
        const includesMatches = exactMatch.length === 0 && startsWithMatches.length === 0
          ? data.results.filter(movie => 
              movie.title.toLowerCase().includes(search.toLowerCase())
            )
          : [];
  
        setSearchMovie([...exactMatch, ...startsWithMatches, ...includesMatches]);
        
      } else {
        const errorData = await res.json();
        console.log(errorData || "Failed to Fetch Search Movie");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const LoadMovieData = async () => {
      try {
        const res = await FetchSearchMovie(search);
        if (res.ok) {
          const data = await res.json();
          setSearchMovie(data.results);
        } else {
          const errorData = await res.json();
          console.log(errorData || "Failed to Fetch Search Movie");
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    if (search.trim()) LoadMovieData();
  }, [search]);

  if (!getSearchMovie) {
    return <div><Loading /></div>;
  }

  return (
    <div className='fixed'>
      <div className='MovieList '>
        <nav className={`navbar navbar-expand-lg navbar-${props.darkMode} bg-${props.darkMode}`}>
          <div className="container gap-">
            {/* <a className="navbar-brand" href="/">Navbar</a> */}
            <div className='LOGO-cineprime d-flex align-items-center'>
              <Link to="/" className="navbar-brand p-0 m-0">
                <img src={CinePrimeBg} alt="CinePrime Logo" style={{ height: '95px', width: '95px', objectFit: 'cover', borderRadius: '50%' }} />
              </Link>
            </div>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                </li>
              </ul>
              <form className="d-flex w-75" onSubmit={LoadMovie}>
                <div className='border border-1 d-flex align-items-center p-2 icon' >
                  <i className='bi bi-search '></i>
                </div>
                <input 
                  className="form-control me-2 search "
                  type="search" 
                  placeholder="Search" 
                  value={search} 
                  onChange={Change} 
                  onKeyDown={handleKeyDown}
                  aria-label="Search"
                />
              </form>
              { user 
                  ? (
                      <div className='d-flex align-items-center justify-content-center'>
                        <p className={`text-${props.darkMode==='light' ? 'dark': 'light'} mb-0`}>Hi, {user.displayName || 'Guest'}</p>
                        <div className="nav-item dropdown">
                          <a 
                            className="nav-link dropdown-toggle" 
                            href="/" 
                            id="userDropdown" 
                            role="button" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                          >
                            <img 
                              src={user?.photoURL ? user.photoURL : moviePoster} 
                              alt="User"
                              style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                            />
                          </a>
                          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                            <li className={`text-${props.darkMode==='light' ? 'dark': 'light'}`}><Link className="dropdown-item" to="/profile">Profile</Link></li>
                            <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
                            <li><Link className="dropdown-item" to={`/bookings`}>Booking</Link></li>
                            <li><hr className="dropdown-divider"/></li>
                            <li>
                              <button 
                                className="dropdown-item" 
                                onClick={() => logout()}
                              >
                                Sign Out
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                  )
                  : <Link to='/SignIn' className="btn btn-outline-danger" type="submit">Sign In</Link>
               }

              <div>
                 <button className={`btn btn-outline-${props.darkMode==='light' ? 'light' : 'dark'}`} onClick={props.EnableDark}>
                   {props.darkMode === 'light' 
                     ? <i className="bi bi-moon"  style={{color:'black'}}></i>
                     : <i className="bi bi-sun-fill" style={{color:'white'}}></i>
                   } 
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
      {showResults && (
        <div 
          className={`container ${getSearchMovie.length <= 0 ? 'hide' : ''}`} 
          ref={searchContainerRef}
        >
          <div className='AddDiv'>
            <div className='row'>
              {getSearchMovie.length > 0 ? (
                getSearchMovie.map((movie) => (
                  <div key={movie.id} className='col-md-3 my-3 SearchItem'>
                    <Link 
                      to={`/movies/${movie.id}`} 
                      state={{ SearchMovie: movie }} 
                      onClick={() => {
                        setSearch('');
                        setShowResults(false);
                      }} 
                      style={{ color: 'white' }}
                    >
                      {movie.title}
                    </Link>
                  </div>
                ))
              ) : (
                <p>No movies found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
