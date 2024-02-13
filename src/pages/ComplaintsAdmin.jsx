import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, IconButton, Button, FormControl, InputLabel, Select, MenuItem, Tooltip } from '@mui/material';
import { AccountCircle, AccessTime, EditNote, CheckCircleOutline } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function ComplaintsAdmin() {
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

    const unaddressedComplaints = complaintList.filter(complaint => complaint.comStatus === 'Unaddressed');

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                All Issues Raised
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
                <Typography variant='body2' sx={{ color: 'gray' }}>
                    {unaddressedComplaints.length === 1 ? '1 Unaddressed Issue' : `${unaddressedComplaints.length} Unaddressed Issues`}
                </Typography>
            </Grid>

            {filteredComplaints.length === 0 ? (
                <Typography sx={{ mt: 4.5 }}>There are no unaddressed issues.</Typography>
            ) : (

                    <Grid container spacing={2} sx={{ mt: 2.5 }}>
                        {
                            filteredComplaints.map((complaint, i) => {
                                return (
                                    <Grid item xs={12} key={complaint.id} >
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Grid sx={{ display: 'flex', alignItems: 'center'}}>
                                                    <AccountCircle sx={{ mr: 1 }} />
                                                    <Typography sx={{ flexGrow: 1 }}>
                                                        {complaint.user?.name}
                                                    </Typography>
                                                    
                                                    {user && (
                                                    <Grid sx={{ display: 'flex', alignItems: 'center'}} color="text.secondary">
                                                        
                                                        {complaint.comStatus === 'Addressed' && (
                                                        <CheckCircleOutline sx={{ padding: '4px', color: 'green', fontSize: '25px' }}/>
                                                        )}

                                                        <Typography variant='body2' sx={{ mr: 1, 
                                                            color: complaint.comStatus === 'Addressed' ? 'green' : 'inherit' }}>
                                                            {complaint.comStatus}
                                                        </Typography>
                                                       
                                                        <Link to={`/respondissue/${complaint.id}`}>
                                                            <Tooltip title={complaint.comStatus === 'Addressed' ? 'Edit Response' : 'Respond'} arrow>
                                                                <IconButton sx={{ ml: 1, padding: '4px' }}>
                                                                    <EditNote />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Link>
                                                        
                                                    </Grid>
                                                    )}
                                                </Grid>

                                                <Box sx={{ alignItems: 'center', mt: 2, mb: 2 }}>
                                                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                                                        Title:
                                                    </Typography>

                                                    <Typography fontSize={17.5} sx={{ mb: 2.5 }}>
                                                        {complaint.comTitle}
                                                    </Typography> 

                                                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                                                        Description:
                                                    </Typography>

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
                                                        Issue raised on {dayjs(complaint.createdAt).format('MMMM D, YYYY, [at] h:mm A')}
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

                                                        <Box sx={{ display: 'flex', alignItems: 'center'}} >
                                                            <AccessTime sx={{ fontSize: 20, mr: 1 }} />
                                                            <Typography variant='body2'>
                                                                Responded on {dayjs(complaint.respondedAt).format('MMMM D, YYYY, [at] h:mm A')}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                )}

                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })
                        }
                    </Grid>
                )
            }
        </Box>
    );
}

export default ComplaintsAdmin;