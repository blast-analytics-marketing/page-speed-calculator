import React, { useState, useEffect } from 'react';
import { useSinglePrismicDocument } from '@prismicio/react';
import { useLocation, useNavigate } from "react-router-dom";
import Util from '../Util';

function Results() {

    const location = useLocation(); //Answers from Questions Component 
    const navigate = useNavigate();
    const props = location.state;
    
    const [isLoading, setLoading] = useState(true);
    const [results, setResults] = useState({});

    const [resultsCMS, resultsCMSState] = useSinglePrismicDocument('results');
    console.log(resultsCMS, 'resultsCMS')

    const notFound = resultsCMSState.state === 'failed';

    const calculator = (answers) => {
        const results = {
            currentRevenue: '$23,540,625',
            newRevenue: '$23,776,031',
            monthlyGain: '$235,406',
            annualGain: '$2,824,875',
            pageSpeedChange: '-8.98%'
        };
        // currentSiteSpeed: answerList[1],
        // avgMonthlySessions: answerList[2],
        // avgOrderVal: answerList[3],
        // estConversionRate: answerList[4],
        // targetSiteSpeed: answerList[5],
        // industry: answerList[6],
        // name: answerList.name,
        // email: answerList.email
        console.log(answers)
        // results.currentRevenue = Avg Monthly Sessions * Estimated Conversion Rate.toFixed(2) * Average Order Value
        results.currentRevenue = (answers.avgMonthlySessions * answers.estConversionRate) * answers.avgOrderVal;
        // results.newRevenue =  ???
        results.newRevenue = ((((((answers.currentSiteSpeed - answers.targetSiteSpeed) * 0.02) * answers.estConversionRate) + answers.estConversionRate) * answers.avgMonthlySessions) * answers.avgOrderVal)
        // results.incRevenueGainMonthly = New Revenue - Current Revenue
        results.monthlyGain = results.newRevenue - results.currentRevenue
        // results.incRevenueGainAnnaul = New Revenue - Current Revenue * 12
        results.annualGain = results.monthlyGain * 12
        // results.pageSpeedChange = Math.abs( (New Speed - Current Speed) / Current Speed * 100  ).toFixed(2)
        results.pageSpeedChange = Math.abs((answers.targetSiteSpeed - answers.currentSiteSpeed) / answers.currentSiteSpeed * 100).toFixed(2)

        results.currentRevenue = results.currentRevenue


        Object.keys(results).forEach(result => { 
            results[result] = results[result].toLocaleString('en-US' , { style: 'currency', currency: 'USD' })
        })
    
        return results;
    };

    useEffect(() => {

        if (Util.readCookie('authorized') !== 'true')  navigate('/auth')
        if (!props || !props.finalAnswerList ) navigate('/')

        setResults(calculator(props.finalAnswerList))
        setLoading(false)

    }, [props])


    if (resultsCMS) {
        const cmsData = resultsCMS.data;

        return (
            <div className="results-page flex flex-col items-center justify-center h-min">

                <div className="results-header content-start w-4/6 pb-10">
                    <div className="results-header-title font-bold text-xxl">{cmsData.results_title}</div>
                    <div className="results-header-subtitle text-xl">{cmsData.results_header_text}</div>
                </div>

                <div className="bg-neutral-700 text-center py-4 w-2/4 text-xxl text-[#fafafa]">
                    <strong>{cmsData.current_revenue_text}</strong>
                    <p className="current-revenue-result">{results.currentRevenue}</p>
                </div> 
                <div className="flex flex-row py-4 flex-wrap w-2/4">
                    <div className="tile-container w-1/2 py-2 flex flex-col">
                        <div className="bg-gray-100 text-center flex flex-col w-[98%] h-full max-sm:w-full justify-center text-xl px-8 py-6 border-2">
                            <strong>{cmsData.new_revenue_text}</strong>
                            <p className="current-revenue-result">{results.newRevenue}</p>
                        </div>
                    </div>
                    <div className="tile-container w-1/2 py-2 flex flex-col items-end">
                        <div className="bg-gray-100 text-center flex flex-col  w-[98%] h-full max-sm:w-full justify-center text-xl px-8 py-6 border-2">
                            <strong>{cmsData.monthly_gain_text}</strong>
                            <p className="current-revenue-result">{results.monthlyGain}</p>
                        </div>
                    </div>
                        <div className="tile-container w-1/2 py-2 flex flex-col">
                    <div className="bg-gray-100 text-center flex flex-col w-[98%] h-full max-sm:w-full justify-center text-xl px-8 py-6 border-2">
                            <div className="block"><strong>{cmsData.annual_gain_text}</strong></div>
                            <p className="current-revenue-result">{results.annualGain}</p>
                        </div>
                    </div>
                    <div className="tile-container w-1/2 py-2 flex flex-col items-end">
                        <div className="bg-gray-100 text-center flex flex-col w-[98%] h-full max-sm:w-full justify-center text-xl px-8 py-6 border-2">
                            <div className="block"><strong>{cmsData.page_speed_change_text}</strong></div>
                            <p className="current-revenue-result">-{results.pageSpeedChange}%</p>
                        </div>
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
