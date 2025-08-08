const API_URL = process.env.REACT_APP_API_URL;
const MainAPI = "https://api.themoviedb.org/3/movie"
const Key = process.env.REACT_APP_TMDB_KEY

export async function fetchMovie() {
    const res = await fetch(`${API_URL}/movies`)
    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to fetch movies")
    }
    return await res.json()
}

export async function SeeData(id){
    const res = await fetch(`${API_URL}/movies/${id}/showtime`)
    if(!res.ok){
        const error = await res.json()
        throw new Error(error.error || "Faild to Fetch the Showtime")
    }
    return await res.json()
}


export async function FetchShowtime(id , date){
    const res = await fetch(`${API_URL}/movies/${id}/showtime/${date}`)
    if(!res.ok){
        const error = await res.json()
        throw new Error(error.error || "Faild to Fetch the Showtime Date")
    }
    return await res.json()
}


export async function fetchActorDetail(id){
    const res = await fetch(`${MainAPI}/${id}/credits?api_key=${Key}`)
    if(!res.ok){
        const error = await res.json()
        throw new Error(error.error || "Failed to fetch Details")
    }
    return await res.json()
}

export async function FetchBookedSeats(id , showtimeID) {
         const res = await fetch(`${API_URL}/movies/${id}/showtime/${showtimeID}/seats`)
         if(!res.ok){
            const errorData = await res.json()
            throw new Error(errorData || "Faild to Fetch the Booked Seats")
         }
        return res
}

export async function FetchDB(id) {
    if (id) {
      try {
        const res = await fetch(`${API_URL}/movies/${id}`);
        if (res.ok) {
          return await res.json();
        } else {
          const data = await fetch(`${MainAPI}/${id}?api_key=${Key}`)
          if (data.ok) {
            return await data.json();
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        return {}; 
      }
    }
    return {}; 
  }


export async function fetchMovieDetail(id){
   const res = await fetch(`${MainAPI}/${id}?api_key=${Key}`)
   if(!res.ok){
    const error = await res.json()
    throw new Error(error.error || "Failed to Fetch Movie Details")
   }
   return await res.json()
   //https://api.themoviedb.org/3/movie/552524?api_key=73fecc316bbe6532810303da979c7447
}

export async function FetchSearchMovie(movie){
    const res = await fetch(`http://api.themoviedb.org/3/search/movie?api_key=${Key}&query={${movie}}`)
    if(!res.ok){
        const errorData = await res.json()
        console.error(errorData || "Faild to Fetch Search Movie")
    }
    return res
}

export async function FetchUserBookingData(userId){
  const res = await fetch(`${API_URL}/getBooking/${userId}`)
  if(!res.ok){
    const errorData = await res.json()
    throw new Error(errorData || 'Faild to Fetch Booking data')
  }
  return await res.json();
}


export async function upcomingMovie() {
  const res = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${Key}&language=en-US&page=1&region=IN`)
  if(!res.ok){
    const errorData = await res.json()
    throw new Error(errorData || 'Failed to Fetch Data')
  }
  return res;
}

export async function fetchTrailer(id) {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${Key}`)
    if(!res.ok){
      const errorData = await res.json()
      throw new Error(errorData || 'Failed to Fetch Trailer')
    }
    return res;
}

export async function AllMovie(){
  const res = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${Key}&region=IN&page=1`)
  if(!res.ok){
    const errorData = await res.json()
    throw new Error(errorData || 'Failed to Fetch All Movies')
  }
  return res;
}
