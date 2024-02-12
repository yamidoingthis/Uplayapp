import './App.css';
import { useState, useEffect } from 'react';
import { Grid, Box, Container, AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Error404 from './pages/error/error404';
import MyTheme from './themes/MyTheme';
import Bookings from './pages/Bookings';
import AddBooking from './pages/AddBooking';
import EditBooking from './pages/EditBooking';
import Cart from './pages/Cart';
import Home from './pages/Home';
import MyForm from './pages/MyForm';
import logo_uplay from './img/logo_uplay.png'
import Activities from './pages/Activities';
import Activity from './pages/Activity';
import AddActivity from './pages/AddActivity';
import EditActivity from './pages/EditActivity';
import AddReview from './pages/AddReview';
import Reviews from './pages/Reviews';
import EditReview from './pages/EditReview';
import ReviewsAdmin from './pages/ReviewsAdmin';
import DeletedReviewsAdmin from './pages/DeletedReviewsAdmin';
import EditReviewAdmin from './pages/EditReviewAdmin';
import HiddenReviewsAdmin from './pages/HiddenReviewsAdmin';
import AddComplaint from './pages/AddComplaint';
import Complaints from './pages/Complaints';
import EditComplaint from './pages/EditComplaint';
import ComplaintsAdmin from './pages/ComplaintsAdmin';
import EditComplaintAdmin from './pages/EditComplaintAdmin';
import Register from './pages/Register';
import Login from './pages/Login';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import http from './http';
import UserContext from './contexts/UserContext';
import EditAccount from './pages/EditAccount';
import ViewAccount from './pages/ViewAccount';
import ViewAccountAdmin from './pages/ViewAccountAdmin';
import ActivitiesPriceAscending from './pages/ActivitiesPriceAscending';
import ActivitiesPriceDescending from './pages/ActivitiesPriceDescending';


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  const appBarStyle = {
    backgroundColor: '#f1f7ee',
  };

  const [menu, setMenu] = useState(null);

  const handleClick = (event) => {
    setMenu(event.currentTarget);
  };

  const handleClose = () => {
    setMenu(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className="AppBar" sx={appBarStyle} elevation={0}>
            <Container>
              <Toolbar disableGutters={true}>
                <Grid container alignItems="center">
                  {user && user.email === "admin@mail.com" ? (
                    <>
                      <Link to="/home"><img src={logo_uplay} alt="Uplay Logo" style={{ height: '35px' }} /></Link>
                      <Box sx={{ flexGrow: 1 }}></Box>
                      <Link to="/home" ><Typography sx={{ mr: 2 }}>Home</Typography></Link>
                      <Link to="/activities" ><Typography sx={{ mr: 2 }}>Activities</Typography></Link>
                      <Link to="/bookings" ><Typography sx={{ mr: 2 }}>Bookings</Typography></Link>
                      <Link to="/reviewsadmin" ><Typography sx={{ mr: 2 }}>All Reviews</Typography></Link>
                      <Link to="/issuesraisedadmin" ><Typography sx={{ mr: 2 }}>Issues Raised</Typography></Link>
                      <Link to="/viewaccountadmin" ><Typography sx={{ mr: 2 }}>All Accounts</Typography></Link>
                    </>
                  ) : (
                    <>
                      <Link to="/home"><img src={logo_uplay} alt="Uplay Logo" style={{ height: '35px' }} /></Link>
                      <Box sx={{ flexGrow: 1 }}></Box>
                      <Link to="/home" ><Typography sx={{ mr: 2 }}>Home</Typography></Link>
                      <Link to="/activities" ><Typography sx={{ mr: 2 }}>Activities</Typography></Link>
                      <Link to="/cart" ><Typography sx={{ mr: 2 }}>Your Cart</Typography></Link>
                    </>
                  )}


                  <IconButton onClick={handleClick}>
                    <AccountCircle sx={{ fontSize: 30 }} />
                  </IconButton>
                  <Menu anchorEl={menu} open={Boolean(menu)} onClose={handleClose}>
                    {user ? ([
                      <Link to="/viewaccount" style={{ textDecoration: 'none', color: 'black' }}>
                        <MenuItem key="viewProfile" onClick={handleClose}>View Profile</MenuItem>
                      </Link>,
                      <Link to="/myreviews" style={{ textDecoration: 'none', color: 'black' }}>
                        <MenuItem key="myreviews" onClick={handleClose}>My Reviews</MenuItem>
                      </Link>,
                      <Link to="/issuesraised" style={{ textDecoration: 'none', color: 'black' }}>
                        <MenuItem key="issuesraised" onClick={handleClose}>Issues Raised</MenuItem>
                      </Link>,
                      <MenuItem key="logout" onClick={() => { handleClose(); logout(); }} style={{ color: 'black' }}>Logout</MenuItem>
                    ]) : ([
                      <MenuItem key="login" onClick={handleClose}>
                        <Link to="/userlogin" style={{ textDecoration: 'none', color: 'black' }}>
                          <Typography>Login</Typography>
                        </Link>
                      </MenuItem>,
                      <MenuItem key="register" onClick={handleClose}>
                        <Link to="/userregister" style={{ textDecoration: 'none', color: 'black' }}>
                          <Typography>Register</Typography>
                        </Link>
                      </MenuItem>
                    ])}
                  </Menu>
                </Grid>
              </Toolbar>
            </Container>
          </AppBar>

          <Container>
            <Routes>
              <Route path={"/"} element={<Home />} />
              <Route path={"/home"} element={<Home />} />
              <Route path={"/bookings"} element={<Bookings />} />
              <Route path={"/addbooking"} element={<AddBooking />} />
              <Route path={"/editbooking/:id"} element={<EditBooking />} />
              <Route path={"/cart/"} element={<Cart />} />
              <Route path={"/activities"} element={<Activities />} />
              <Route path={"/activitiespriceascending"} element={<ActivitiesPriceAscending />} />
              <Route path={"/activitiespricedescending"} element={<ActivitiesPriceDescending />} />
              <Route path={"/activity/:id"} element={<Activity />} />
              <Route path={"/addactivity"} element={<AddActivity />} />
              <Route path={"/editactivity/:id"} element={<EditActivity />} />
              <Route path={"/addreview/:id"} element={<AddReview />} />
              <Route path={"/reviews/:id"} element={<Reviews />} />
              <Route path={"/editreview/:id"} element={<EditReview />} />
              <Route path={"/reviewsadmin"} element={<ReviewsAdmin />} />
              <Route path={"/deletedreviewsadmin"} element={<DeletedReviewsAdmin />} />
              <Route path={"/moderatereviewadmin/:id"} element={<EditReviewAdmin />} />
              <Route path={"/hiddenreviews"} element={<HiddenReviewsAdmin />} />
              <Route path={"/raiseissue"} element={<AddComplaint />} />
              <Route path={"/issuesraised"} element={<Complaints />} />
              <Route path={"/editissue/:id"} element={<EditComplaint />} />
              <Route path={"/issuesraisedadmin"} element={<ComplaintsAdmin />} />
              <Route path={"/respondissue/:id"} element={<EditComplaintAdmin />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
              <Route path={"/userregister"} element={<UserRegister />} />
              <Route path={"/userlogin"} element={<UserLogin />} />
              <Route path={"/viewaccount"} element={<ViewAccount />} />
              <Route path={"/editaccount"} element={<EditAccount />} />
              <Route path={"/viewaccountadmin"} element={<ViewAccountAdmin />} />
              <Route path={"/form"} element={<MyForm />} />
              {/* Error pages */}
              <Route path="/404" element={<Error404 />} />
              <Route path="*" element={<Error404 />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;