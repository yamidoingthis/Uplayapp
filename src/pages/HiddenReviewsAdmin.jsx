import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Input, Button, IconButton, ToggleButton, ToggleButtonGroup, Rating, Tooltip} from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, EditNote } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function HiddenReviewsAdmin() {
    const [reviewList, setReviewList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getReviews = () => {
        http.get('/review').then((res) => {
            const filteredReviews = res.data.filter(review => review.revStatus === "Hidden");
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
                Hidden Reviews
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search in hidden reviews"
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
                    {reviewList.length === 1 ? '1 Hidden Review' : `${reviewList.length} Hidden Reviews`}
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
                                    <Box sx={{ mt: 3.5 }}>
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

export default HiddenReviewsAdmin;