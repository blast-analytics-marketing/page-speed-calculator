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

        // if (Util.readCookie('authorized') !== 'true')  navigate('/auth')
        // if (!props || !props.finalAnswerList ) navigate('/')

        setResults(calculator(props.finalAnswerList))
        setLoading(false)

    }, [props])


    if (resultsCMS) {
        const cmsData = resultsCMS.data;

        return (
            <div className="result-container">
                        <div className='result-header'><strong>Expected Results:</strong></div>
                        <div className="bg-neutral-700 text-center py-4 w-full text-xxl text-[#fafafa]">
                            <strong>{cmsData.current_revenue_text}</strong>
                            <p className="current-revenue-result">{results.currentRevenue}</p>
                        </div>
                        <div className="result">
                            <div className="bg-gray-100 text-center flex flex-col w-full h-full max-sm:w-full justify-center text-xl px-8 py-4 border-t-2 border-x-2">
                                <strong>{cmsData.new_revenue_text}</strong>
                                <p className="current-revenue-result">^{results.newRevenue}</p>
                            </div>
                        </div>
                        <div className="result">
                            <div className="bg-gray-100 text-center flex flex-col  w-full h-full max-sm:w-full justify-center text-xl px-8 py-4 border-x-2">
                                <strong>{cmsData.monthly_gain_text}</strong>
                                <p className="current-revenue-result">^{results.monthlyGain}</p>
                            </div>
                        </div>
                        <div className="result">
                            <div className="bg-gray-100 text-center flex flex-col w-full h-full max-sm:w-full justify-center text-xl px-8 py-4 border-x-2">
                                <div className="block"><strong>{cmsData.annual_gain_text}</strong></div>
                                <p className="current-revenue-result">^{results.annualGain}</p>
                            </div>
                        </div>
                        <div className="result">
                            <div className="bg-gray-100 text-center flex flex-col w-full h-full max-sm:w-full justify-center text-xl px-8 py-4 border-x-2">
                                <div className="block"><strong>{cmsData.page_speed_change_text}</strong></div>
                                <p className="current-revenue-result">^{results.pageSpeedChange}</p>
                            </div>
                        </div>
                        <div className="result-cta">
                            <div className="bg-gray-100 text-center flex flex-col w-full h-full max-sm:w-full items-center text-l px-8 py-4 border-x-2 border-b-2">
                                <button disabled={true} onClick={() => console.log('Clicked')} className="results-cta-btn bg-neutral-500 rounded-sm hover:bg-neutral-700 hover:cursor-pointer">
                                    <div className="results-cta-txt font-bold text-[#fafafa] px-4 py-2">How BlastX Can Help</div>
                                </button>          
                            </div>
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
