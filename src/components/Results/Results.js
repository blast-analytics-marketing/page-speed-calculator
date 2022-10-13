import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import './Results.css';

function Results(props) {

    const location = useLocation

    useEffect(() => {
        console.log(location.state)
    })

    return (
        <div className="results-container">
            Results
        </div>
    );
}

export default Results;
