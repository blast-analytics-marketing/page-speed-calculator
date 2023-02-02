import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSinglePrismicDocument, useAllPrismicDocumentsByType } from '@prismicio/react';
import Styles from './Style.js';
import Util from '../Util';

function Form() {
    const [formGeneral, formGeneralState] = useSinglePrismicDocument('form_general')
    const [formQuestions, formQuestionsState] = useAllPrismicDocumentsByType('form_question')
    const [resultsCMS, resultsCMSState] = useSinglePrismicDocument('results');
    const [resultsNum, setResultsNum] = useState({
        currentRevenue: 0,
        newRevenue: 0,
        monthlyGain: 0,
        annualGain: 0,
        pageSpeedChange: 0    
    });
    const [answerList, setAnswerList] = useState({
        'name': '',
        'email': ''
    });
    const [arrows, setArrows] = useState(false);
    const [formError, setFormError] = useState(false);

    const notFound =
        formGeneralState.state === "failed" || formQuestionsState.state === "failed" || resultsCMSState.state === "failed";

    const filterQuestionData = (cmsData) => {
        const formQuestionsCleaned = {};
        cmsData.forEach((questionItem, i) => {
            let q = questionItem.data
            if (q.question_enabled === true) {
                formQuestionsCleaned[q.question_order] = { title: q.question_title, type: q.question_type }
                if (q.question_dropdown_options.length > 1) formQuestionsCleaned[q.question_order].dropdownOptions = q.question_dropdown_options
            }
        })

        return formQuestionsCleaned
    }

    const handleChange = (e, questionNum) => {
        // checkValidity(e)
        let newAnswerList = {
            ...answerList,
        }
        newAnswerList[questionNum] = e.target.value

        setAnswerList(newAnswerList)

        const calcs = {
            currentRevenue: 0,
            newRevenue: 0,
            monthlyGain: 0,
            annualGain: 0,
            pageSpeedChange: 0
        }

        const answers = {
            currentSiteSpeed: parseFloat(newAnswerList[1]),
            avgMonthlySessions: Number(newAnswerList[2]),
            avgOrderVal: parseFloat(newAnswerList[3]),
            estConversionRate: parseFloat(newAnswerList[4]) * Math.pow(10, -2),
            targetSiteSpeed: parseFloat(newAnswerList[5]),
            industry: newAnswerList[6],
            name: newAnswerList.name,
            email: newAnswerList.email
        }

        if (answers && answers.avgMonthlySessions && answers.estConversionRate && answers.avgOrderVal) {
            // calcs.currentRevenue = Avg Monthly Sessions * Estimated Conversion Rate.toFixed(2) * Average Order Value
            calcs.currentRevenue = (answers.avgMonthlySessions * answers.estConversionRate) * answers.avgOrderVal;
            let newState = resultsNum
            newState.currentRevenue =  calcs.currentRevenue
            setResultsNum( newState )
        }

        if (answers && answers.currentSiteSpeed && answers.targetSiteSpeed && answers.estConversionRate && answers.avgMonthlySessions && answers.avgOrderVal) {
            calcs.newRevenue = ((((((answers.currentSiteSpeed - answers.targetSiteSpeed) * 0.02) * answers.estConversionRate) + answers.estConversionRate) * answers.avgMonthlySessions) * answers.avgOrderVal)
            let newState = resultsNum
            newState.newRevenue =  calcs.newRevenue
            setResultsNum( newState )
            setArrows(true)
        } 
        if(resultsNum.newRevenue && resultsNum.currentRevenue) {
            // calcs.incRevenueGainMonthly = New Revenue - Current Revenue
            calcs.monthlyGain = resultsNum.newRevenue - resultsNum.currentRevenue 
            let newState = resultsNum
            newState.monthlyGain =  calcs.monthlyGain 
            setResultsNum( newState )
        }
        if (resultsNum.monthlyGain) {
            // calcs.incRevenueGainAnnaul = New Revenue - Current Revenue * 12
            calcs.annualGain = resultsNum.monthlyGain * 12
            let newState = resultsNum
            newState.annualGain = calcs.annualGain 
            setResultsNum( newState )
        }
        if (answers && answers.targetSiteSpeed && answers.currentSiteSpeed) {
            // calcs.pageSpeedChange = Math.abs( (New Speed - Current Speed) / Current Speed * 100  ).toFixed(2)
            calcs.pageSpeedChange = Math.abs((answers.targetSiteSpeed - answers.currentSiteSpeed) / answers.currentSiteSpeed * 100).toFixed(2)
            let newState = resultsNum
            newState.pageSpeedChange = "-" + calcs.pageSpeedChange + "%"
        
            setResultsNum( newState )
        }

        return calcs;
    }

    const mapInputType = (type, questionNum, options) => {
        if (type === 'Dropdown') {
            return (
                <select className={`dropdown-input text-center w-5/6 rounded-sm ${Styles.input_dropdown}`} defaultValue="Select Industry" onChange={e => handleChange(e, questionNum)}>
                    <option key={0} value={"Select Industry"} disabled={true}>Select Industry</option>
                    {options.map((o, i) => <option key={i + 1} value={o.option}>{o.option}</option>)}
                </select>
            )
        } else if (type === 'Integer') {
            return <input type="number" className={`integer-input text-center w-3/5 ${Styles.input_number}`} min="0" step="100" value={answerList[questionNum] || 0} onChange={e => handleChange(e, questionNum)} />
        } else { //Float
            return <input type="number" className={`float-input text-center w-3/5 ${Styles.input_number}`} min="0" step="0.01" value={answerList[questionNum] || 0} onChange={e => handleChange(e, questionNum)} />
        }
    }

    const insertArrow = () => {
        let el = ''; 
        if(arrows) {
            el = <i className="w-0 h-0 border-solid border-transparent border-b-black border-r-[6px] border-b-[12px] border-l-[6px] inline-block mr-1"></i>
        } 
        return el;
    }

    useEffect(() => {
    }, [])

    let errorMessage;
    if (formError) {
        errorMessage = <p className="text-red">Please enter a value for all fields</p>
    } else {
        errorMessage = <p className="hidden">Test</p>

    }

    if (formQuestions && formGeneral && resultsCMS) {
        const cmsData = resultsCMS.data;
        const questionsCMS = filterQuestionData(formQuestions);
        const generalCMS = { ...formGeneral.data }
        // console.log(questionsCMS, 'QUESTIONS DATA FILTERED')
        // console.log(generalCMS, 'GENERAL DATA')

        return (
            <div className="form-page flex flex-col items-center justify-center h-min">
                <div className="form-header content-start w-5/6 py-10">
                    <div className="form-title"><strong>{generalCMS.form_header_title}</strong></div>
                    <div className="form-subtitle">{generalCMS.form_header_text}</div>
                </div>
                <div className="form-container flex flex-row w-5/6 max-sm:flex-col">
                    <div className="form-questions bg-orange min-h-50 flex flex-col w-1/2">
                        {
                            Object.keys(questionsCMS).map((q, i) => {
                                return (
                                    <div className="flex flex-col pb-4 flex-wrap items-start " key={i}>
                                        <div className="text-left flex pb-5"><strong>{questionsCMS[q].title}</strong></div>
                                        <div className="text-right flex">{mapInputType(questionsCMS[q].type, q, questionsCMS[q].dropdownOptions)}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="form-results min-h-50 flex flex-col w-1/2 max-sm:w-full">
                        <div className="result-container">
                            <div className='result-header'><strong>Expected Results:</strong></div>
                            <div className="bg-neutral-700 text-center py-4 w-full text-xxl text-[#fafafa]">
                                <strong>{cmsData.current_revenue_text}</strong>
                                <p className="current-revenue-result">{resultsNum.currentRevenue.toLocaleString('en-US' , { style: 'currency', currency: 'USD' })}</p>
                            </div>
                            <div className="result">
                                <div className="bg-gray-100 text-center flex flex-col w-full h-full max-sm:w-full justify-center text-xl px-8 py-4 border-t-2 border-x-2">
                                    <strong>{cmsData.new_revenue_text}</strong>
                                    <p className="current-revenue-result">{insertArrow(0)}{resultsNum.newRevenue.toLocaleString('en-US' , { style: 'currency', currency: 'USD' })}</p>
                                </div>
                            </div>
                            <div className="result">
                                <div className="bg-gray-100 text-center flex flex-col  w-full h-full max-sm:w-full justify-center text-xl px-8 py-4 border-x-2">
                                    <strong>{cmsData.monthly_gain_text}</strong>
                                    <p className="current-revenue-result">{insertArrow(1)}{resultsNum.monthlyGain.toLocaleString('en-US' , { style: 'currency', currency: 'USD' })}</p>
                                </div>
                            </div>
                            <div className="result">
                                <div className="bg-gray-100 text-center flex flex-col w-full h-full max-sm:w-full justify-center text-xl px-8 py-4 border-x-2">
                                    <div className="block"><strong>{cmsData.annual_gain_text}</strong></div>
                                    <p className="current-revenue-result">{insertArrow(2)}{resultsNum.annualGain.toLocaleString('en-US' , { style: 'currency', currency: 'USD' })}</p>
                                </div>
                            </div>
                            <div className="result">
                                <div className="bg-gray-100 text-center flex flex-col w-full h-full max-sm:w-full justify-center text-xl px-8 py-4 border-x-2">
                                    <div className="block"><strong>{cmsData.page_speed_change_text}</strong></div>
                                    <p className="current-revenue-result">{resultsNum.pageSpeedChange.toLocaleString('en-US' , { style: 'currency', currency: 'USD' })}</p>
                                </div>
                            </div>
                            <div className="result-cta">
                                <div className="bg-gray-100 text-center flex flex-col w-full h-full max-sm:w-full items-center text-l px-8 py-4 border-x-2 border-b-2">
                                    <button disabled={false} onClick={() => window.open('https://www.blastx.com/how-we-help', '_blank')} className="results-cta-btn bg-neutral-500 rounded-sm hover:bg-neutral-700 hover:cursor-pointer">
                                        <div className="results-cta-txt font-bold text-[#fafafa] px-4 py-2">How BlastX Can Help</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*<span className="w-full my-8 py-0.5 bg-gray-200 lg:w-2/4"></span>
                {errorMessage} */}
                {/* Email Gate Box */}
                {/* <div className="results-container p-6 bg-neutral-700 min-w-[50%] min-h-250 flex flex-col justify-center items-start">
                    <div className="results-inputs py-2.5 flex flex-row">
                        <input className="results-name rounded-sm pl-3 pr-20 py-3 mr-2" type="text" placeholder="Name" value={answerList["name"]} onChange={e => handleChange(e, "name")}></input>
                        <input className="results-email rounded-sm pl-3 pr-20 py-3 mr-2"  type="email" placeholder="Business Email" value={answerList["email"]} onChange={e => handleChange(e, "email")}></input>
                        <button disabled={buttonDisable} onClick={() => submitData()} className="questions-next-btn bg-neutral-400 rounded-sm font-bold px-3 py-3 text-[#fafafa]">
                            {generalCMS.view_results_button}
                        </button>                    
                    </div>
                </div> */}
                <div className="notes-section content-start w-5/6 pb-10 pt-10">
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
    } else if (notFound) {
        return <div>LOADING...</div>
    }
}

export default Form;
