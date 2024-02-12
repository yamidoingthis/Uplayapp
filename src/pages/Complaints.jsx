import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, IconButton, Button, FormControl, InputLabel, Select, MenuItem, Tooltip } from '@mui/material';
import { AccountCircle, AccessTime, Edit, CheckCircleOutline } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function Complaints() {
    const [complaintList, setComplaintList] = useState([]);
    const { user } = useContext(UserContext);

    const getComplaints = () => {
        http.get('/complaint').then((res) => {
            setComplaintList(res.data);
        });
    };

    useEffect(() => {
        getComplaints();
    }, []);

    const [display, setDisplay] = useState("");

    const handleChange = (event) => {
        setDisplay(event.target.value);
    };

    const filteredComplaints = complaintList.filter((complaint) => {
        if (display === '') {
            return complaint.comStatus === 'Unaddressed';
        }
        return complaint.comStatus === display;
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Issues Raised
            </Typography>

            <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box sx={{ minWidth: 170, maxWidth: 170 }}>
                    <FormControl fullWidth size='small'>
                        <InputLabel>Select</InputLabel>
                        <Select
                        value={display}
                        label="Select"
                        onChange={handleChange} >
                            <MenuItem value=''><em>Unaddressed</em></MenuItem>
                            <MenuItem value='Addressed'>Addressed</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box />
                {
                    user && (
                        <Link to="/raiseissue" style={{ textDecoration: 'none' }}>
                            <Button variant='contained'>
                                Raise Issue
                            </Button>
                        </Link>
                    )
                }
            </Grid>

            {complaintList.length === 0 ? (
                <Typography sx={{ mt: 4.5 }}>There are no unaddressed issues.</Typography>
            ) : (

                    <Grid container spacing={2} sx={{ mt: 2.5 }}>
                        {
                            filteredComplaints.map((complaint, i) => {
                                const isUserComplaint = user && user.id === complaint.userId

                                return isUserComplaint ? (
                                    <Grid item xs={12} key={complaint.id} >
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Box sx={{ display: 'flex', mb: 1, width: '100%' }}>
                                                    <Typography variant='h6' sx={{ flexGrow: 1}}>
                                                        {complaint.comTitle}
                                                    </Typography> 
                                                    
                                                    {user && user.id === complaint.userId && (
                                                    <Grid sx={{ display: 'flex', alignItems: 'center'}} color="text.secondary">
                                                        
                                                        {complaint.comStatus === 'Addressed' && (
                                                        <CheckCircleOutline sx={{ padding: '4px', color: 'green', fontSize: '25px' }}/>
                                                        )}

                                                        <Typography variant='body2' sx={{ mr: 1, 
                                                        color:
                                                        complaint.comStatus === 'Addressed' ? 'green' : 'inherit' }}>
                                                            {complaint.comStatus}
                                                        </Typography>

                                                        {complaint.comStatus === 'Unaddressed' && (
                                                        <Link to={`/editissue/${complaint.id}`}>
                                                            <Tooltip title="Edit" arrow>
                                                                <IconButton sx={{ ml: 1, padding: '4px' }}>
                                                                    <Edit />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Link>
                                                        )}
                                                    </Grid>
                                                    )}
                                                </Box>

                                                <Box sx={{ alignItems: 'center', mt: 2, mb: 2 }}>
                                                    {complaint.comSugg && (
                                                    <>
                                                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                                                        Description:
                                                    </Typography>
                                                    </>
                                                    )}

                                                    <Typography fontSize={17.5} sx={{ mb: 2.5 }}>
                                                        {complaint.comDesc}
                                                    </Typography>

                                                    {complaint.comSugg && (
                                                    <>
                                                    <Typography variant='body2' sx={{ color: 'text.secondary'}}>
                                                        Proposed Solution:
                                                    </Typography>
                                                    <Typography fontSize={17.5} sx={{ mb: 2.5 }}>
                                                        {complaint.comSugg}
                                                    </Typography>
                                                    </>
                                                    )}
                                                </Box>


                                                <Box sx={{ display: 'flex', alignItems: 'center'}} color="text.secondary">
                                                    <AccessTime sx={{ fontSize: 20, mr: 1 }} />
                                                    <Typography variant='body2'>
                                                        Issue raised on {dayjs(complaint.createdAt).format('MMMM D, YYYY')}
                                                    </Typography>
                                                </Box>

                                                { complaint.comResp && (
                                                    <Box sx={{ alignItems: 'center', mt: 3, backgroundColor: '#f5f5f5', padding: 2, borderRadius: 2 }}>
                                                        <Box sx={{ alignItems: 'center', mb: 2.5 }}>
                                                            <Typography variant='body2' sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                                Response:
                                                            </Typography>
                                                            <Typography fontSize={17.5}>
                                                                {complaint.comResp}
                                                            </Typography>
                                                        </Box>

                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }} >
                                                            <AccessTime sx={{ fontSize: 20, mr: 1 }} />
                                                            <Typography variant='body2'>
                                                                Responded on {dayjs(complaint.createdAt).format('MMMM D, YYYY')}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                )}

                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ) : null;
                            })
                        }
                    </Grid>
                )
            }
        </Box>
    );
}

export default Complaints;