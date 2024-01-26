import './App.css';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Bookings from './pages/Bookings';
import AddBooking from './pages/AddBooking';
import EditBooking from './pages/EditBooking';
import MyForm from './pages/MyForm';
import logo_uplay from './img/logo_uplay.png'

function App() {
  return (
    <Router>
      <ThemeProvider theme={MyTheme}>
        <AppBar position="static" className="AppBar" sx={{ background: "#F9A64E" }}>
          <Container>
            <Toolbar disableGutters={true}>
              <Link to="/">
                <Typography variant="h6" component="div">
                <img src={logo_uplay} alt="Uplay Logo" style={{ height: '40px', marginRight: '10px' }} />
                </Typography>
              </Link>
              <Link to="/bookings" style={{ textDecoration: 'none', color: 'black'}}>
                <Typography sx={{ fontWeight: 'medium', fontSize:'20px',  '&:hover': { color: '#454545' }, fontFamily: 'Monospace' }}>Bookings</Typography>
              </Link>
            </Toolbar>
          </Container>
        </AppBar>

        <Container>
          <Routes>
            <Route path={"/"} element={<Bookings />} />
            <Route path={"/bookings"} element={<Bookings />} />
            <Route path={"/addbooking"} element={<AddBooking />} />
            <Route path={"/editbooking/:id"} element={<EditBooking />} />
            <Route path={"/form"} element={<MyForm />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;
