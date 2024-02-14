import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import http from '../http';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ViewAccountAdmin() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const searchAccounts = () => {
        const lowercaseSearch = search.toLowerCase();
        http.get(`/user?search=${lowercaseSearch}`).then((res) => {
            setUsers(res.data);
        });
    };

    const getAccounts = () => {
        http.get('/user/all').then((res) => {
            setUsers(res.data);
        });
    };


    useEffect(() => {
        getAccounts();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchAccounts();
        }
    };

    const onClickSearch = () => {
        searchAccounts();
    }

    const onClickClear = () => {
        setSearch('');
        getAccounts();
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                All User Accounts
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
            </Box>



            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Birth date</TableCell>
                            <TableCell>NRIC</TableCell>
                            <TableCell>Phone</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            // Check if the user's email is not "admin@mail.com"
                            user.email !== 'admin@mail.com' && (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{formatDate(user.birthDate)}</TableCell>
                                    <TableCell>{user.nric}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                </TableRow>
                            )
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>

            <ToastContainer />
        </Box>
    );
}

export default ViewAccountAdmin;
