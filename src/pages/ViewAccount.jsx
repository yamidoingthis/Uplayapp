import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AccountCircle, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';

function ViewAccount() {
    const [u, setUser] = useState({});
    const { user } = useContext(UserContext);

    const getAccount = () => {
        http.get(`/user/${user.id}`).then((res) => {
            setUser(res.data);
        });
    };

    useEffect(() => {
        getAccount();
    }, []);

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                User Details
            </Typography>

            {user && (
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6">Name: {u.name}</Typography>
                        <br />
                        <Typography variant="body1">Email: {u.email}</Typography>
                        <Typography variant="body1">Phone Number: {u.phone}</Typography>
                        <Typography variant="body1">NRIC: {u.nric}</Typography>
                        <Typography variant="body1">
                            Birthdate: {dayjs(u.birthDate).format('DD-MM-YYYY')}
                        </Typography>
                    </CardContent>
                    <Box display="flex" justifyContent="flex-end" p={2}>
                        <Link to="/editaccount">
                            <Button variant="contained" endIcon={<Edit />}>
                                Edit
                            </Button>
                        </Link>
                    </Box>
                </Card>
            )}
        </Box>
    );
}

export default ViewAccount;
