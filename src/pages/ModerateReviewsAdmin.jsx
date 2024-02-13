import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Input, Snackbar, Button, IconButton, ToggleButton, ToggleButtonGroup, Rating, Tooltip} from '@mui/material';
import { Dialog, DialogTitle, DialogContent, } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Check, Notes } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function ModerateReviewsAdmin() {
    const [reviewList, setReviewList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getReviews = () => {
        http.get('/review').then((res) => {
            const filteredReviews = res.data.filter(review => review.revFlag === "Flagged" && review.revStatus !== "Deleted" && review.revStatus !== "Hidden");
            setReviewList(filteredReviews);
        });
    };

    const searchReviews = () => {
        http.get(`/review?search=${search}`).then((res) => {
            setReviewList(res.data);
        });
    };

    useEffect(() => {
        getReviews();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchReviews();
        }
    };

    const onClickSearch = () => {
        searchReviews();
    }

    const onClickClear = () => {
        setSearch('');
        getReviews();
    };

    const [dialog, setDialog] = useState(false);

    const [activity, setActivity] = useState({
        name: "",
        description: "",
        location: "",
        price: 0.00
    });

    const openDialog = (activityId) => {
        http.get(`/Activity/${activityId}`).then((res) => {
            console.log(res.data);
            setActivity(res.data);
            setDialog(true);
        });
    };

    const closeDialog = () => {
        setDialog(false);
    };

    const [approveSnackbar, setApproveSnackbar] = useState(false);
    const [rejectSnackbar, setRejectSnackbar] = useState(false);
    
    const handleClose = () => {
        setApproveSnackbar(false);
        setRejectSnackbar(false);
      };

    const approveReview = (reviewId) => {
        setApproveSnackbar(true);
        http.put(`/review/approve/${reviewId}`)
        .then((res) => {
            console.log(res.data);
            getReviews()
        });
    };

    const hideReview = (reviewId) => {
        setRejectSnackbar(true)
        http.delete(`/review/hide/${reviewId}`)
        .then((res) => {
            console.log(res.data);
            getReviews()
        });
    };

    const [formats, setFormats] = React.useState([]);

    const handleFormat = (event, newFormats) => {
        setFormats(newFormats);
    };

    const filteredReviews = formats.length === 0
        ? reviewList
        : reviewList.filter((review) => formats.includes(review.revStar.toString()));

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                All Pending Reviews
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search in pending reviews"
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
                <Box sx={{ flexGrow: 1 }} />
            </Box>

            <Grid container justifyContent="space-between" alignItems="center">
                <Grid container justifyContent="space-between" alignItems="center" sx={{ width: 480 }}>
                    <Typography variant='body2' sx={{ color: 'gray' }}>Filter By Stars</Typography>
                    
                    <ToggleButtonGroup
                    size="small"
                    value={formats}
                    onChange={handleFormat}
                    >
                        <ToggleButton value="5">
                            <Box sx={{ textTransform: 'none', ml: 1, mr: 1 }}><Typography variant='body2'>5 Stars</Typography></Box>
                        </ToggleButton>
                        <ToggleButton value="4">
                            <Box sx={{ textTransform: 'none', ml: 1, mr: 1 }}><Typography variant='body2'>4 Stars</Typography></Box>
                        </ToggleButton>
                        <ToggleButton value="3">
                            <Box sx={{ textTransform: 'none', ml: 1, mr: 1 }}><Typography variant='body2'>3 Stars</Typography></Box>
                        </ToggleButton>
                        <ToggleButton value="2">
                            <Box sx={{ textTransform: 'none', ml: 1, mr: 1 }}><Typography variant='body2'>2 Stars</Typography></Box>
                        </ToggleButton>
                        <ToggleButton value="1">
                            <Box sx={{ textTransform: 'none', ml: 1, mr: 1 }}><Typography variant='body2'>1 Star</Typography></Box>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Grid>

                <Typography variant='body2' sx={{ color: 'gray' }}>
                    {reviewList.length === 1 ? '1 Pending Review' : `${reviewList.length} Pending Reviews`}
                </Typography>
            </Grid>

            {reviewList.length === 0 ? (
                <Typography sx={{ mt: 4.5 }}>There are no pending reviews.</Typography>
            ) : (

                filteredReviews.length === 0 ? (
                    <Typography sx={{ mt: 4.5 }}>There are no pending reviews  for your selected filter(s).</Typography>
                ) : (

                    <Grid container spacing={2} sx={{ mt: 2.5 }}>
                        {
                            filteredReviews.map((review, i) => {
                                return (
                                    <Grid item xs={12} key={review.id}>
                                    <Box sx={{ display: 'flex', mb: 1, width: '100%' }}>
                                        <AccountCircle sx={{ mr: 1 }} />
                                        <Typography sx={{ flexGrow: 1 }}>
                                            {review.user?.name}
                                        </Typography>

                                        <Tooltip title="View Activity Details" arrow>
                                            <IconButton sx={{ padding: '4px', mr: 1, color: 'primary' }} onClick={() => openDialog(review.activityId)}>
                                                <Notes />
                                            </IconButton>
                                        </Tooltip>
                                        
                                        <Tooltip title="Approve Review" arrow>
                                            <IconButton sx={{ padding: '4px', mr: 1, color: 'green' }} onClick={() => approveReview(review.id)}>
                                                <Check />
                                            </IconButton>
                                        </Tooltip>
                                        <Snackbar
                                        open={approveSnackbar}
                                        autoHideDuration={1500}
                                        onClose={handleClose}
                                        message="Review has been approved"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        />
                                        
                                        <Tooltip title="Reject Review" arrow>
                                            <IconButton sx={{ padding: '4px', color: '#ba000d' }} onClick={() => hideReview(review.id)}>
                                                <Clear />
                                            </IconButton>
                                        </Tooltip>
                                        <Snackbar
                                        open={rejectSnackbar}
                                        autoHideDuration={1500}
                                        onClose={handleClose}
                                        message="Review has been rejected and hidden"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Rating
                                    name="star"
                                    value={review.revStar}
                                    size="medium"
                                    readOnly />
                                    </Box>
    
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Typography fontSize={17.5}>
                                            {review.revDesc}
                                        </Typography>   
                                    </Box>
                                    
                                    {review.revStatus === 'Edited' && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                        <Typography variant='body2'>
                                            Edited
                                        </Typography>
                                    </Box>
                                    )}
    
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                        <AccessTime sx={{ fontSize: 20, mr: 1 }} />
                                        <Typography variant='body2'>
                                            Posted on {dayjs(review.createdAt).format('MMMM D, YYYY, [at] h:mm A')}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mt: 3 }}>
                                        <hr />
                                    </Box>
                                </Grid>
                                )
                            })
                        }
                    </Grid>
                )
            )}
            
            <Dialog open={dialog} onClose={closeDialog} PaperProps={{ sx: { minWidth: '600px' } }}> 
                <IconButton onClick={closeDialog} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <Clear />
                </IconButton>

                <DialogContent dividers>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 18 }}>
                        Activity Details
                    </Typography>
                    <Typography sx={{ mt: 1.5 }}>
                        Activity: {activity.name}
                    </Typography>
                    <Typography sx={{ mt: 1.5 }}>
                        Description: {activity.description}
                    </Typography>
                    <Typography sx={{ mt: 1.5 }}>
                        Location: {activity.location}
                    </Typography>
                    <Typography sx={{ mt: 1.5 }}>
                        Price: ${activity.price}
                    </Typography>
                </DialogContent>
            </Dialog>
        </Box>
    );
}

export default ModerateReviewsAdmin;