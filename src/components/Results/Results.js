import React, { useState, useEffect } from 'react';
import { useSinglePrismicDocument } from '@prismicio/react';
import { useLocation } from "react-router-dom";
import './Results.css';

function Results() {

    const location = useLocation(); //Answers from Questions Component 

    const answers = location.state;
    const [isLoading, setLoading] = useState(true);
    const [results, setResults] = useState({});


    const [resultsCMS, resultsCMSState] = useSinglePrismicDocument('results');
    console.log(resultsCMS, 'resultsCMS')

    const notFound = resultsCMSState.state === 'failed';

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


    if (resultsCMS) {
        const cmsData = resultsCMS.data;

        return (
            <div className="results-page flex flex-col items-center justify-center h-min">
                <div className="results-header content-start w-4/6 pb-10">
                    <div className="results-header-title font-bold">{cmsData.results_title}</div>
                    <div className="results-header-subtitle ">{cmsData.results_header_text}</div>
                </div>
                <div className="bg-green-900 text-center py-4 w-2/4">
                    {cmsData.current_revenue_text}
                    <p className="current-revenue-result"><strong>{results.currentRevenue}</strong></p>
                </div> 
                <div className="bg-green-900 flex flex-row py-4 flex-wrap w-2/4">
                    <div className="bg-orange-400 text-center flex flex-col w-3/6">
                        {cmsData.new_revenue_text}
                        <p className="current-revenue-result"><strong>{results.newRevenue}</strong></p>
                    </div>
                    <div className="bg-orange-500 text-center flex flex-col w-3/6">
                        {cmsData.annual_gain_text}
                        <p className="current-revenue-result"><strong>{results.monthlyGain}</strong></p>
                    </div>
                </div> 
                <div className="bg-green-900 flex flex-row py-4 flex-wrap w-2/4">
                    <div className="bg-orange-400 text-center flex flex-col w-3/6">
                        {cmsData.monthly_gain_text}
                        <p className="current-revenue-result"><strong>{results.annualGain}</strong></p>
                    </div>
                    <div className="bg-orange-500 text-center flex flex-col w-3/6">
                        {cmsData.page_speed_change_text}
                        <p className="current-revenue-result"><strong>{results.pageSpeedChange}</strong></p>
                    </div>
                </div> 
                <div className="notes-section content-start w-4/6 pb-10">
                    <div className="notes-title font-bold">{cmsData.supporting_data_title}</div>
                    <div className="notes-subtitle ">{cmsData.supporting_data_text}</div>
                    <ul className="notes-list list-disc pl-8">
                        {
                            cmsData.supporting_data_bullets.map((data, i) => {
                                return <li key={i}><a href={data.source} target="_blank"><span className="font-bold">{data.title}</span></a> {data.description}</li>
                            })
                        }
                    </ul>
                </div>
            </div>
            // <div className="results-container">
            //     <h2>Business Impact</h2>
            //     <p>{cmsData.text1} <strong>{results.currentRevenue}</strong></p>
            //     <p>{cmsData.text2} <strong>{results.newRevenue}</strong></p>
            //     <p>{cmsData.text3} <strong>{results.monthlyGain}</strong></p>
            //     <p>{cmsData.text4} <strong>{results.annualGain}</strong></p>
            //     <p>{cmsData.text5} <strong>{results.pageSpeedChange}</strong></p>
            //     <p><i>Potential Thank You Message</i></p>
            // </div>
        )

    } else if (isLoading || notFound) {

        return (
            <div className="results-container">
                <h2>Loading...</h2>
            </div>
        )

    }

}

export default Results;
