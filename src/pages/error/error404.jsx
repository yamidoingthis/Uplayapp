import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './error404.css';

const Error404 = () => {
  useEffect(() => {
    console.log("404 page mounted");
    // You can perform any other side effects here
    return () => {
      console.log("404 page unmounted");
      // You can perform cleanup or additional actions before unmounting
    };
  }, []); // The empty dependency array means this effect runs once on mount

  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h1>404</h1>
        </div>
        <h2>Oops! This Page Could Not Be Found</h2>
        <p>
          Sorry but the page you are looking for does not exist, has been removed, name changed, or is temporarily unavailable
        </p>
        <Link to="/">Go To Homepage</Link>
      </div>
    </div>
  );
};

export default Error404;
