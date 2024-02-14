import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import BannerBackground from "../img/home-banner-background.png";
import BannerImage from "../img/happyfamily.png";
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from "react-icons/fi";
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';

function Home() {
    const [itemList, setItemList] = useState([]);
    const [search, setSearch] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            http.get('/user/auth').then((res) => {
                setUser(res.data.user);
            });
        }
    }, []);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getItems = () => {
        // Your implementation for fetching items
    };

    const searchItems = () => {
        // Your implementation for searching items
    };

    useEffect(() => {
        getItems();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchItems();
        }
    };

    const onClickSearch = () => {
        searchItems();
    }

    const onClickClear = () => {
        setSearch('');
        getItems();
    };

    return (
        <div className="home-container">
            <div className="home-banner-container">
                <div className="home-bannerImage-container">
                    <img src={BannerBackground} alt="" />
                </div>
                <div className="home-text-section">
                    <h1 className="primary-heading">
                        You Play, We'll Do The Rest
                    </h1>
                    <p className="primary-text">
                        More than just a booking platform, UPlay aspires to connect people from all walks of life,
                        forging new relationships over time as they find a common thread through shared interests.
                    </p>
                    <button className="secondary-button" onClick={() => navigate(user ? '/activities' : '/userlogin')}>
                        Book Now <FiArrowRight />
                    </button>
                    
                </div>
                <div className="home-image-section">
                    <img src={BannerImage} alt="" />
                </div>
            </div>
        </div>
    );
}

export default Home;




