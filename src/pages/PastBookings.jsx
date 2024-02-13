import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Input,
    IconButton,
    Button,
    Card,
    CardContent,
    Grid,
} from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { AccessTime, Search, Clear, Delete, AccountCircle } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import UserContext from '../contexts/UserContext';

function PastBookings() {
    const { user } = useContext(UserContext);
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
        if (e.key === 'Enter') {
            searchBookings();
        }
    };

    const onClickSearch = () => {
        searchBookings();
    };

    const onClickClear = () => {
        setSearch('');
        getBookings();
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Past Bookings
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
            </Box>

            {bookingList.length === 0 ? (
                <Typography variant="body1" sx={{ mb: 2 }}>
                    You haven't made any bookings yet.
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {bookingList
                        .filter((booking) => booking.status === 'Confirmed' && booking.name === user.name)
                        .map((booking) => {
                            // Check if the status is Confirmed
                            if (booking.status === 'Confirmed') {
                                return (
                                    <Grid item xs={12} key={booking.id}>
                                        <Card>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', mb: 1 }}>
                                                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                        {booking.activity}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <AccountCircle sx={{ mr: 1 }} />
                                                    <Typography color="text.secondary">
                                                        Bought by: {booking.name}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <AccessTime sx={{ mr: 1 }} />
                                                    <Typography>
                                                        {booking.date} {booking.time}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <Typography color="text.secondary">
                                                        Total Pax: {booking.quantity}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <Typography color="text.secondary">
                                                        Booked at:{' '}
                                                        {dayjs(booking.createdAt).format(global.datetimeFormat)}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            }

                            return null; // Skip rendering this booking if the status is not Confirmed
                        })}
                </Grid>
            )}
        </Box>
    );
}
export default PastBookings;
