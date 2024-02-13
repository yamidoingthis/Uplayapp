import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Grid, Input, Snackbar, IconButton, ToggleButton, ToggleButtonGroup, Rating, Tooltip} from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit, Flag} from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function Reviews() {
    const { id } = useParams();

    const [reviewList, setReviewList] = useState([]);
    const [starList, setStarList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getReviews = () => {
        http.get(`/review/activity/${id}`).then((res) => {
            const filteredReviews = res.data.filter(review => review.revStatus !== "Deleted" && review.revStatus !== "Hidden");
            setReviewList(filteredReviews);
            setStarList(filteredReviews);
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

    const [activity, setActivity] = useState({
        name: "",
    });

    useEffect(() => {
        http.get(`/Activity/${id}`).then((res) => {
            setActivity(res.data);    
        
        }).catch(error => {
            console.error('Error fetching activity:', error);
        });
    }, []);

    const [snackbar, setSnackbar] = useState(false);

    const handleClick = () => {
        setSnackbar(true);
      };
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setSnackbar(false);
      };

    const flagReview = (reviewId) => {
        http.delete(`/review/flag/${reviewId}`)
            .then((res) => {
                console.log(res.data);
            })
    };

    const totalRatings = starList.reduce((acc, review) => acc + review.revStar, 0);
    const averageRating = totalRatings / starList.length;

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
                Reviews for {activity.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search in reviews"
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
            {starList.length !== 0 && ( 
                <Grid container alignItems="center" sx={{ mt: 2, mb: 3 }}>
                    <Grid container alignItems="center" sx={{ width: 110 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {averageRating.toFixed(1)}
                        </Typography>
                        
                        <Typography variant="h6" sx={{ ml: 1 }}>
                            out of 5
                        </Typography>
                    </Grid>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                        <Rating
                        name="star"
                        value={averageRating}
                        size="large"
                        precision={0.5}
                        readOnly 
                        />
                    </Box>
                </Grid>
            )}

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
                    {reviewList.length === 1 ? '1 Review Posted' : `${reviewList.length} Reviews Posted`}
                </Typography>
            </Grid>

            {reviewList.length === 0 ? (
                <Typography sx={{ mt: 4.5 }}>There are no reviews found.</Typography>
            ) : (

                filteredReviews.length === 0 ? (
                    <Typography sx={{ mt: 4.5 }}>There are no reviews found for your selected filter(s).</Typography>
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
                                        
                                        {user && (
                                            <Box sx={{ display: 'flex', alignItems: 'center'}} color="text.secondary">
                                                {user.id === review.userId ? (
                                                <Link to={`/editreview/${review.id}`}>
                                                    <Tooltip title="Edit Review" arrow>
                                                        <IconButton sx={{ padding: '4px' }}>
                                                            <Edit />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Link>
                                                ) : (
                                                <Tooltip title="Flag Review" arrow>
                                                    <IconButton sx={{ padding: '4px' }} onClick={() => { flagReview(review.id); handleClick(); }}>
                                                        <Flag />
                                                    </IconButton>
                                                </Tooltip>
                                                )}
                                                <Snackbar
                                                open={snackbar}
                                                autoHideDuration={1500}
                                                onClose={handleClose}
                                                message="Review flagged"
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                />
                                            </Box>
                                        )}
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
                                            Posted on {dayjs(review.createdAt).format('MMMM D, YYYY')}
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
        </Box>
    );
}

export default Reviews;