import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { AccessTime, Search, Clear, Edit, Delete, ShoppingCart } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';

function Cart() {
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
                navigate("/cart");
            });
    }

    

    const handleCheckout = (bookingId) => {
        http.put(`/booking/status/${bookingId}`)
            .then((res) => {
                console.log(res.data);
                // Add any additional logic you need after a successful checkout
                toast.success("Checkout successful!");
            })
            .catch((error) => {
                console.error("Checkout failed:", error);
                toast.error("Checkout failed");

            });
    };





    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Cart
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>

            </Box>

            <Grid container spacing={2}>
                {
                    bookingList.map((booking, i) => {
                        // Check if the status is Confirmed
                        if (booking.status === 'Confirmed') {
                            return null; 
                        }
                        return (
                            <Grid item xs={12} md={12} lg={12} key={booking.id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {booking.activity}
                                            </Typography>
                                            <Link to={`/editbooking/${booking.id}`}>
                                                <IconButton color="inherit" sx={{ padding: '4px' }}>
                                                    <Edit />
                                                </IconButton>
                                            </Link>

                                            <IconButton color="error" sx={{ padding: '4px' }} onClick={() => handleClickOpenDeleteDialog(booking.id)} >
                                                <Delete />
                                            </IconButton>


                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <AccessTime sx={{ mr: 1 }} />
                                            <Typography>
                                                Made at: {dayjs(booking.createdAt).format(global.datetimeFormat)}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            Date of activity: {booking.date}
                                        </Typography>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            Time of activity: {booking.time}
                                        </Typography>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            No. of tickets: {booking.quantity}
                                        </Typography>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            Made by: {booking.name}
                                        </Typography>
                                       
                                    </CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                                    <Typography sx={{ whiteSpace: 'pre-wrap', mr: 110 }}>
                                           Total Price: {booking.quantity*booking.price}
                                        </Typography>

                                        <Button variant="contained" color="success" onClick={() => handleCheckout(booking.id)}>
                                            <ShoppingCart />
                                            Checkout
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
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
            <ToastContainer />
        </Box>
    );
}

export default Cart;