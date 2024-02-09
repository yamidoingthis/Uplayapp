import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Input, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { AccessTime, Search, Clear, Delete } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';

function Bookings() {
  const [bookingList, setBookingList] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();


  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getBookings = () => {
    http.get('/booking').then((res) => {
      setBookingList(res.data);
    });
  };

  const searchBookings = () => {
    http.get(`/booking?search=${search}`).then((res) => {
      setBookingList(res.data);
    });
  };

  useEffect(() => {
    getBookings();
  }, [bookingList]);

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchBookings();
    }
  };

  const onClickSearch = () => {
    searchBookings();
  }

  const onClickClear = () => {
    setSearch('');
    getBookings();
  };

  const [idToDelete, setIdToDelete] = useState(null);  // New state to store the ID of the booking to be deleted
  const [open, setOpen] = useState(false);

  const handleClickOpenDeleteDialog = (id) => {
    const handleOpen = () => {
      setOpen(true);
    };
    setIdToDelete(id);
    handleOpen();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteBooking = () => {
    http.delete(`/booking/${idToDelete}`)
      .then((res) => {
        console.log(res.data);
        handleClose();
        navigate("/bookings");
      });
  }


  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        All Bookings
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Input
          value={search}
          placeholder="Search"
          onChange={onSearchChange}
          onKeyDown={onSearchKeyDown}
        />
        <IconButton color="primary" onClick={onClickSearch}>
          <Search />
        </IconButton>
        <IconButton color="primary" onClick={onClickClear}>
          <Clear />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />
        <Link to="/addbooking" style={{ textDecoration: 'none' }}>
          <Button variant="contained">Add</Button>
        </Link>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Activity</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Made By</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookingList.map((booking) => {
              // Check if the status is Confirmed
              if (booking.status === 'Confirmed') {
                return (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.activity}</TableCell>
                    <TableCell>
                      {dayjs(booking.createdAt).format(global.datetimeFormat)}
                    </TableCell>
                    <TableCell>{booking.quantity}</TableCell>
                    <TableCell>{booking.name}</TableCell>
                    <TableCell>
                      <IconButton color="error" sx={{ padding: '4px' }} onClick={() => handleClickOpenDeleteDialog(booking.id)} >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              }

              return null; // Skip rendering this booking if the status is not Confirmed
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Delete Booking
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this booking?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit"
            onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error"
            onClick={deleteBooking}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Bookings;
