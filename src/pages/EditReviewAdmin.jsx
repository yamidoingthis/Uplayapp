import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Rating, FormControl, FormHelperText, Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton } from '@mui/material';
import { Clear, AccessTime, AccountCircle } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';

function EditReviewAdmin() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [review, setReview] = useState({
        RevStar: 0,
        RevDesc: "",
        RevStatus: "",
        ActivityId: 0
    });

    const [activity, setActivity] = useState({
        name: "",
        description: "",
        location: "",
        price: 0.00
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/review/${id}`).then((res) => {
            setReview(res.data);
            setLoading(false);
    
            formik.setValues({
                RevStar: res.data.revStar,
                RevDesc: res.data.revDesc,
                RevStatus: res.data.revStatus,
                RevFlag: res.data.revFlag,
                ActivityId: res.data.activityId

            });
        });
    }, [id]);

    useEffect(() => {
        if (review.activityId && review.activityId !== 0) {
            http.get(`/Activity/${review.activityId}`).then((res) => {
                console.log(res.data);
                setActivity(res.data);
            });
        }
    }, [review.activityId]);

    const approveReview = () => {
        http.put(`/review/approve/${id}`)
        .then((res) => {
            console.log(res.data);
            navigate("/reviewsadmin");
        });
    };

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const hideReview = () => {
        http.delete(`/review/hide/${id}`)
        .then((res) => {
            console.log(res.data);
            navigate("/hiddenreviews");
        });
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Moderate Review
            </Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>
                Activity Details
            </Typography>

            <Box sx={{ alignItems: 'center', mb: 2, mt: 2 }}>
                <Typography variant='body2' sx={{ color: 'text.secondary'}}>
                    Activity Name:
                </Typography>
                
                <Typography fontSize={17.5}>
                    {activity.name}
                </Typography>
            </Box>

            <Box sx={{ alignItems: 'center', mb: 2, mt: 2 }}>
                <Typography variant='body2' sx={{ color: 'text.secondary'}}>
                    Activity Description:
                </Typography>
                
                <Typography fontSize={17.5}>
                    {activity.description}
                </Typography>
            </Box>

            <Box sx={{ alignItems: 'center', mb: 2, mt: 2 }}>
                <Typography variant='body2' sx={{ color: 'text.secondary'}}>
                    Location:
                </Typography>
                
                <Typography fontSize={17.5}>
                    {activity.location}
                </Typography>
            </Box>

            <Box sx={{ alignItems: 'center', mb: 2, mt: 2 }}>
                <Typography variant='body2' sx={{ color: 'text.secondary'}}>
                    Price:
                </Typography>
                
                <Typography fontSize={17.5}>
                    ${activity.price}
                </Typography>
            </Box>

            {
                !loading && (
                    <Box component="form">
                        <Box sx={{ alignItems: 'center', mb: 2, mt: 2 }}>
                            <Typography variant="h6">
                                Review Details
                            </Typography>

                            <Typography variant='body2' sx={{ color: 'text.secondary', mt: 2}}>
                                User:
                            </Typography>
                            <Box sx={{ display: 'flex'}}>
                                <AccountCircle sx={{ mr: 1 }} />
                                <Typography fontSize={17.5}>
                                    {review.user?.name}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2, mt: 2 }}>
                            <Typography variant='body2' sx={{ color: 'text.secondary'}}>
                                Stars:
                            </Typography>
                            
                            <Rating
                            name="star"
                            value={review.revStar}
                            size="large"
                            readOnly />
                        </Box>
                        
                        <Box sx={{ alignItems: 'center', mb: 2, mt: 2 }}>
                            <Typography variant='body2' sx={{ color: 'text.secondary'}}>
                                Description:
                            </Typography>
                            
                            <Typography fontSize={17.5}>
                                {review.revDesc}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                            <AccessTime sx={{ fontSize: 20, mr: 1 }} />
                            <Typography variant='body2'>
                                Posted on {dayjs(review.createdAt).format('MMMM D, YYYY')}
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 3, mb: 4 }}>
                            <Button variant="contained" sx={{ mr: 2 }} onClick={approveReview}>
                                Approve
                            </Button>
                            <Button variant="contained"color="error" onClick={handleOpen}>
                                Reject & Hide
                            </Button>
                        </Box>
                    </Box>
                )
            }

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Rejecting Review
                </DialogTitle>
                <IconButton
                onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <Clear />
                </IconButton>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to reject and hide this review?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={hideReview}>
                        Reject & Hide
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default EditReviewAdmin;