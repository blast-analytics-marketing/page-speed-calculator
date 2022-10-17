import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import './Results.css';

function Results() {

    const location = useLocation(); //Answers from Questions Component 
    
    const answers = location.state;
    const [isLoading, setLoading] = useState(true);
    const [results, setResults] = useState({});

    let finalResults;

    const calculator = answers => {
        const results = { test: "TEST"};
        // results.currentRevenue = Avg Monthly Sessions * Estimated Conversion Rate.toFixed(2) * Average Order Value
        // results.newRevenue =  ???
        // results.incRevenueGainMonthly = New Revenue - Current Revenue
        // results.incRevenueGainAnnaul = New Revenue - Current Revenue * 12
        // results.pageSpeedChange = Math.abs( (New Speed - Current Speed) / Current Speed * 100  ).toFixed(2)
        return results;
    };

    useEffect(() => {
        console.log(answers);
        setResults(calculator(answers))
        setLoading(false)
    }, [])

    return (
        <div className="results-page">
            {
                isLoading ? 
                <div className="results-container">
                    <h2>Loading...</h2>
                </div>  
                :
                <div className="results-container">
                    <h2>Business Impact</h2>
                    <p>Test: <span>{results.test}</span></p>
                </div>
            }
        </div>
    );
}

export default Results;
