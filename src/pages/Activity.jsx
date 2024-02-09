import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function Activity() {
    const { id } = useParams();
    const [activity, setActivity] = useState([]);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const getActivity = () => {
        http.get(`/Activity/${id}`).then((res) => {
            setActivity(res.data);
        });
    };

    useEffect(() => {
        getActivity();
    }, []);

    const handleAddBooking = () => {
        navigate(`/addbooking?name=${activity.name}&price=${activity.price}`);
    };

    return (
        <Box sx={{ my: 5, display: 'flex' }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={8}>
                    <Typography variant="h5" sx={{ flexGrow: 1 }}>
                        {activity.name}
                    </Typography>
                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                        Type: {activity.type}
                    </Typography>
                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                        Description: {activity.description}
                    </Typography>
                    <Typography>
                        Vendor: {activity.vendor?.name}
                    </Typography>
                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                        Location: {activity.location}
                    </Typography>
                    <Typography>
                        {dayjs(activity.activityDate).format(global.datetimeFormat)}
                    </Typography>
                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                        Price: ${activity.price}
                    </Typography>
                    {/* Add Booking Button */}
                    <Button variant="contained" color="primary" onClick={handleAddBooking}>
                        Add Booking
                    </Button>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    {
                        activity.imageFile && (
                            <Box className="aspect-ratio-container">
                                <img alt="tutorial"
                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${activity.imageFile}`}>
                                </img>
                            </Box>
                        )
                    }
                    <Typography variant='h5'>
                        Caption
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Activity;
