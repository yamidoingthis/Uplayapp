import './App.css';
import { useState, useEffect } from 'react';
import { Box, Container, AppBar, Toolbar, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Bookings from './pages/Bookings';
import AddBooking from './pages/AddBooking';
import EditBooking from './pages/EditBooking';
import MyForm from './pages/MyForm';
import logo_uplay from './img/logo_uplay.png'
import Activities from './pages/Activities';
import Activity from './pages/Activity';
import AddActivity from './pages/AddActivity';
import EditActivity from './pages/EditActivity';
import Register from './pages/Register';
import Login from './pages/Login';
import http from './http';
import UserContext from './contexts/UserContext';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/Vendor/auth').then((res) => {
        setUser(res.data.vendor);
      });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className="AppBar">
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Typography variant="h6" component="div">
                    <img src={logo_uplay} alt="Uplay Logo" style={{ height: '40px', marginRight: '10px' }} />
                  </Typography>
                </Link>
                <Box sx={{ flexGrow: 1 }}></Box>
                <Typography style={{ textDecoration: 'none', color: 'black' }} sx={{ mx: 5 }} component="div">Home</Typography>
                <Link to="/activities" style={{ textDecoration: 'none', color: 'black' }}><Typography sx={{ mx: 5 }} component="div">Activities</Typography></Link>
                <Link to="/bookings" style={{ textDecoration: 'none', color: 'black' }}><Typography sx={{ mx: 5 }}>Bookings</Typography></Link>
                <Typography style={{ textDecoration: 'none', color: 'black' }} sx={{ mx: 5 }} component="div">About Us</Typography>
                <Typography style={{ textDecoration: 'none', color: 'black' }} sx={{ mx: 5 }} component="div">Your Cart</Typography>
                {user && (
                  <>
                    <Typography>{user.name}</Typography>
                    <Button onClick={logout}>Logout</Button>
                  </>
                )
                }
                {!user && (
                  <>
                    <Link to="/register" style={{ textDecoration: 'none', color: 'black' }}><Typography>Register</Typography></Link>
                    <Link to="/login" style={{ textDecoration: 'none', color: 'black' }}><Typography>Login</Typography></Link>
                  </>
                )}
              </Toolbar>
            </Container>
          </AppBar>

          <Container>
            <Routes>
              <Route path={"/"} element={<Bookings />} />
              <Route path={"/bookings"} element={<Bookings />} />
              <Route path={"/addbooking"} element={<AddBooking />} />
              <Route path={"/editbooking/:id"} element={<EditBooking />} />
              <Route path={"/activities"} element={<Activities />} />
              <Route path={"/activity/:id"} element={<Activity />} />
              <Route path={"/addactivity"} element={<AddActivity />} />
              <Route path={"/editactivity/:id"} element={<EditActivity />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
              <Route path={"/form"} element={<MyForm />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
