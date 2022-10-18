import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import './Results.css';

function Results() {

    const location = useLocation(); //Answers from Questions Component 
    
    const answers = location.state;
    const [isLoading, setLoading] = useState(true);
    const [results, setResults] = useState({});

    const cmsData = { 
        text1: "Current Monthly Revenue:",
        text2: "Estimated New Monthly Revenue:",
        text3: "Estimated Incremental Revenue Gain (Monthly):",
        text4: "Estimated Incremental Revenue Gain (Annual):",
        text5: "Percentage Page Speed Change:",
    }

    const calculator = answers => {
        const results = { 
            currentRevenue: '$23,540,625',
            newRevenue: '$23,776,031',
            monthlyGain: '$235,406',
            annualGain: '$2,824,875',
            pageSpeedChange: '-8.98%'
        };
        // results.currentRevenue = Avg Monthly Sessions * Estimated Conversion Rate.toFixed(2) * Average Order Value
        // results.newRevenue =  ???
        // results.incRevenueGainMonthly = New Revenue - Current Revenue
        // results.incRevenueGainAnnaul = New Revenue - Current Revenue * 12
        // results.pageSpeedChange = Math.abs( (New Speed - Current Speed) / Current Speed * 100  ).toFixed(2)
        return results;
    };

    useEffect(() => {
        // Pull in CMS Data Here 
        console.log(answers);
        setResults(calculator(answers))
        setLoading(false)
    }, [answers])

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
                    <p>{cmsData.text1} <strong>{results.currentRevenue}</strong></p>
                    <p>{cmsData.text2} <strong>{results.newRevenue}</strong></p>
                    <p>{cmsData.text3} <strong>{results.monthlyGain}</strong></p>
                    <p>{cmsData.text4} <strong>{results.annualGain}</strong></p>
                    <p>{cmsData.text5} <strong>{results.pageSpeedChange}</strong></p>
                    <p><i>Potential Thank You Message</i></p>
                </div>
            }
        </div>
    );
}

export default Results;
