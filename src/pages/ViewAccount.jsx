import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';

function ViewAccount() {
    const [userDetails, setUserDetails] = useState({});
    const { user } = useContext(UserContext);

    const getAccount = () => {
        http.get(`/user/${user.id}`).then((res) => {
            setUserDetails(res.data);
        });
    };

    useEffect(() => {
        getAccount();
    }, []);

    return (
        <Box>
            <Typography variant="h3" sx={{ my: 2 }}>
                User Details
            </Typography>

            {user && (
                <Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1">Name:</Typography>
                            <Typography variant="h6">{userDetails.name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1">Email:</Typography>
                            <Typography variant="body1">{userDetails.email}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1">Phone Number:</Typography>
                            <Typography variant="body1">{userDetails.phone}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1">NRIC:</Typography>
                            <Typography variant="body1">{userDetails.nric}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1">Birthdate:</Typography>
                            <Typography variant="body1">
                                {dayjs(userDetails.birthDate).format('DD-MM-YYYY')}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Link to="/confirmpassword" style={{ textDecoration: 'none' }}>
                            <Button variant="contained" endIcon={<Edit />}>
                                Edit
                            </Button>
                        </Link>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default ViewAccount;
