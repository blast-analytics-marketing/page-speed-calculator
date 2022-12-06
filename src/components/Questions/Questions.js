import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSinglePrismicDocument, useAllPrismicDocumentsByType } from '@prismicio/react';
import Styles from './Style.js';
import Util from '../Util';

function Questions() {
    const [formGeneral, formGeneralState] = useSinglePrismicDocument('form_general')
    const [formQuestions, formQuestionsState] = useAllPrismicDocumentsByType('form_question')

    const [buttonDisable, setButtonDisable] = useState(true);
    const [answerList, setAnswerList] = useState({});
  
    const notFound =
        formGeneralState.state === "failed" || formQuestionsState.state === "failed";

    const navigate = useNavigate();

    const handleAuth = () => {
        if ( Util.readCookie('authorized') === 'true' ) {
            return true
        } else {
            return false
        }
    }

    const submitData = async () => {
        
        // results.currentRevenue = Avg Monthly Sessions * Estimated Conversion Rate.toFixed(2) * Average Order Value
        // results.newRevenue =  ???
        // results.incRevenueGainMonthly = New Revenue - Current Revenue
        // results.incRevenueGainAnnaul = New Revenue - Current Revenue * 12
        // results.pageSpeedChange = Math.abs( (New Speed - Current Speed) / Current Speed * 100  ).toFixed(2)

        const finalAnswerList = {
            currentSiteSpeed: answerList[1],
            avgMonthlySessions: answerList[2],
            avgOrderVal: answerList[3],
            estConversionRate: answerList[4],
            targetSiteSpeed: answerList[5],
            industry: answerList[6],
            name: answerList.name,
            email: answerList.email
        }

        navigate('/results', { state: { finalAnswerList } })
        // Data Submission Logic Here (Usage of API, etc.)
    }

    const filterQuestionData = (cmsData) => {
        const formQuestionsCleaned = {};
        cmsData.forEach((questionItem, i) => {
            let q = questionItem.data
            if(q.question_enabled === true) {
                formQuestionsCleaned[q.question_order] = { title: q.question_title, type: q.question_type }
                if(q.question_dropdown_options.length > 1) formQuestionsCleaned[q.question_order].dropdownOptions = q.question_dropdown_options
            }
        })

        return formQuestionsCleaned
    }

    const handleChange = (e, questionNum) => {
        checkValidity(e)
        let newAnswerList = {
            ...answerList,
        }
        newAnswerList[questionNum] = e.target.value
        setAnswerList(newAnswerList)
    }

    const checkValidity = (e) => {
        let fieldValue = e.target.value;
        if (fieldValue.length > 0) {
            setButtonDisable(false)
        }
    }

    const mapInputType = (type, questionNum, options) => {
        if (type === 'Dropdown'){
            return (
                <select className={`dropdown-input text-center w-4/6 rounded-sm ${Styles.input_dropdown}`} defaultValue="Select Industry" onChange={e => handleChange(e, questionNum)}>
                    <option key={0} value={"Select Industry"} disabled={true}>Select Industry</option>
                    {options.map((o, i)=> <option key={i+1} value={o.option}>{o.option}</option>)}
                </select>   
            )
        } else if (type === 'Integer') {
            return <input type="number" className={`integer-input text-center w-2/6 ${Styles.input_number}`} min="0" step="100" defaultValue={0} value={answerList[questionNum]} onChange={e => handleChange(e, questionNum)}/>
        } else { //Float
            return <input type="number" className={`float-input text-center w-2/6 ${Styles.input_number}`} min="0" step="0.01" defaultValue={0} value={answerList[questionNum]} onChange={e => handleChange(e, questionNum)}/>
        }
    }


    useEffect(() => {
        if (!handleAuth()) navigate('/auth')
    }, [])

    if (formQuestions && formGeneral) {
        const questionsCMS = filterQuestionData(formQuestions);
        const generalCMS = { ...formGeneral.data }
        console.log(questionsCMS, 'QUESTIONS DATA FILTERED')
        console.log(generalCMS, 'GENERAL DATA')

        return (
            <div className="questions-page flex flex-col items-center justify-center h-min">
                <div className="questions-header content-start w-4/6 pb-10">
                    <div className="questions-title"><strong>{generalCMS.form_header_title}</strong></div> 
                    <div className="questions-subtitle">{generalCMS.form_header_text}</div> 
                </div>
                {
                    Object.keys(questionsCMS).map((q, i) => {
                        return (
                            <div className="flex flex-row py-4 flex-wrap w-2/4" key={i}>
                                <div className="text-left flex flex-col justify-center w-3/6">{questionsCMS[q].title}</div>
                                <div className="text-right flex flex-col justify-center items-end w-3/6">{mapInputType(questionsCMS[q].type, q ,questionsCMS[q].dropdownOptions)}</div>
                            </div> 
                        )
                    })
                }
                <span className="w-full my-8 py-0.5 bg-gray-200 lg:w-2/4"></span>
                <div className="results-container p-6 bg-neutral-700 min-w-[50%] min-h-250 flex flex-col justify-center items-start"> {/* RESULTS BOX */}
                    <div className="results-title font-extrabold text-[#fafafa]">{generalCMS.contact_info_text}</div>
                    <div className="results-inputs py-2.5 flex flex-row">
                        <input className="results-name rounded-sm pl-3 pr-20 py-3 mr-2" type="text" placeholder="Name" value={answerList["name"]} onChange={e => handleChange(e, "name")}></input>
                        <input className="results-email rounded-sm pl-3 pr-20 py-3 mr-2"  type="email" placeholder="Business Email" value={answerList["email"]} onChange={e => handleChange(e, "email")}></input>
                        <button disabled={buttonDisable} onClick={() => submitData()} className="questions-next-btn bg-neutral-400 rounded-sm font-bold px-3 py-3 text-[#fafafa]">
                            {generalCMS.view_results_button}
                        </button>                    
                    </div>
                </div>
            </div>
        )
    } else if (notFound) {
        return <div>LOADING...</div>
    }
}

export default Questions;
