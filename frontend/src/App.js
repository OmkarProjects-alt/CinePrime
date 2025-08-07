// import MovieList from './Commponants/MovieList';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import NavBar from './Commponants/NavBar';
// import { useState } from 'react';
// import ShowMovieDetails from './Commponants/ShowMovieDetails';
// import ShowTime from './Commponants/ShowTime';
// import Seats from './Commponants/Seats';
// import SignIn from './Authentication/SignIn';
// import Payment from './Commponants/Payment'
// import { AuthProvider } from './Authentication/AuthContext';


// function App() {
//   const [darkMode, setDarkMode] = useState('dark');

//   const EnableDark = () => {
//     if(darkMode === 'dark'){
//       setDarkMode('light');
//       document.body.style.backgroundColor="white"
//     }else{
//       setDarkMode('dark')
//       document.body.style.backgroundColor="black"
//     }
//   }
//   return (
//     <Router>
//       <NavBar darkMode={darkMode} EnableDark={EnableDark}/>
//           <Routes>
//             <Route path="/" element={<MovieList />} />
//             <Route path="/movies/:id" element={<ShowMovieDetails dark={darkMode}/>}/>
//             <Route path='/movies/:id/showtime' element={<ShowTime/> } />
//             <Route path='/movies/:id/showtime/:id/seats' element={<Seats/>} />
//             {/* Add more routes as needed */}

//             <Route path='/SignIn' element={<AuthProvider><SignIn/></AuthProvider>} />
//             <Route path='movies/:id/showtime/:id/seats/payment' element={<Payment/>} />
//           </Routes>
//     </Router>
      
//   );
// }

// export default App;




// import MovieList from './Commponants/MovieList';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import NavBar from './Commponants/NavBar';
// import { useState } from 'react';
// import ShowMovieDetails from './Commponants/ShowMovieDetails';
// import ShowTime from './Commponants/ShowTime';
// import Seats from './Commponants/Seats';
// import SignIn from './Authentication/SignIn';
// import SignUp from './Authentication/SignUp';
// import Payment from './Commponants/Payment';
// import { AuthProvider } from './Authentication/AuthContext';

// function App() {
//   const [darkMode, setDarkMode] = useState('dark');

//   const EnableDark = () => {
//     if(darkMode === 'dark'){
//       setDarkMode('light');
//       document.body.style.backgroundColor="white";
//     }else{
//       setDarkMode('dark');
//       document.body.style.backgroundColor="black";
//     }
//   };

//   return (
//     <Router>
//       <AuthProvider>
//         {/* EmailLinkHandler should be inside AuthProvider but outside Routes */}
//         <NavBar darkMode={darkMode} EnableDark={EnableDark}/>
//         <Routes>
//           <Route path="/" element={<MovieList />} />
//           <Route path="/movies/:id" element={<ShowMovieDetails dark={darkMode}/>}/>
//           <Route path='/movies/:id/showtime' element={<ShowTime/>} />
//           <Route path='/movies/:id/showtime/:id/seats' element={<Seats/>} />
//           <Route path='/movies/:id/showtime/:id/seats/payment' element={<Payment/>} />
          
//           {/* Authentication Routes */}
//           <Route path='/signin' element={<SignIn/>} />
//           <Route path='/signup' element={<SignUp/>} />
//         </Routes>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;





import MovieList from './Commponants/MovieList';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './Commponants/NavBar';
import { useState } from 'react';
import ShowMovieDetails from './Commponants/ShowMovieDetails';
import ShowTime from './Commponants/ShowTime';
import Seats from './Commponants/Seats';
import SignIn from './Authentication/SignIn';
import SignUp from './Authentication/SignUp';
import Payment from './Commponants/Payment';
import { AuthProvider } from './Authentication/AuthContext';
import LogIn from './Authentication/LogIn'
import ForgotPassword from './Authentication/ForgotPassword';
import Booking from './Commponants/Booking';
import { MoviesProvider } from './Commponants/MoviesContext';

// Wrap Routes with NavBar conditionally
function NavBarWrapper({ children, darkMode, EnableDark }) {
  const location = useLocation();
  const hideNavbarPaths = ['/signin', '/signup' , '/login']; // Add paths where NavBar should NOT appear

  const showNavBar = !hideNavbarPaths.some(path => location.pathname.startsWith(path));

  return (
    <>
      {showNavBar && <NavBar darkMode={darkMode} EnableDark={EnableDark} />}
      {children}
    </>
  );
}

document.body.style.backgroundColor = 'white'

function App() {
  const [darkMode, setDarkMode] = useState('light');

  const EnableDark = () => {
    if (darkMode === 'light') {
      setDarkMode('dark');
      document.body.style.backgroundColor = "black";
    } else {
      setDarkMode('light');
      document.body.style.backgroundColor = "white";
    }
  };

  return (
    <MoviesProvider>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Routes where NavBar should appear */}
            <Route
              path="*"
              element={
                <NavBarWrapper darkMode={darkMode} EnableDark={EnableDark}>
                  <Routes>
                    <Route path="/" element={<MovieList />} />
                    <Route path="/movies/:id" element={<ShowMovieDetails dark={darkMode} />} />
                    <Route path="/movies/:id/showtime" element={<ShowTime dark={darkMode} />} />
                    <Route path="/movies/:id/showtime/:id/seats" element={<Seats dark={darkMode} />} />
                    <Route path="/movies/:id/showtime/:id/seats/payment" element={<Payment dark={darkMode} />} />
                    <Route path="/bookings" element={<Booking dark={darkMode} />} />
                  </Routes>
                </NavBarWrapper>
              }
            />
            
            {/* Routes where NavBar should NOT appear */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path='/login' element={<LogIn/>} />
            <Route path='/forgotpassword' element={<ForgotPassword/>} />
          </Routes>
        </AuthProvider>
      </Router>
    </MoviesProvider>
  );
}

export default App;