import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSinglePrismicDocument, useAllPrismicDocumentsByType } from '@prismicio/react';
import './Questions.css';

function Questions() {
    const [formGeneral, formGeneralState] = useSinglePrismicDocument('form_general')
    const [formQuestions, formQuestionsState] = useAllPrismicDocumentsByType('form_question')

    // console.log(formGeneral, 'formGeneral')
    // console.log(formQuestions, 'formQuestion')

    const testingData = {
        btnText: "Next",
        btnText2: "View your results"
    }   

    const formQuestionsTest = {
        0: { q: "What is your current site speed (seconds)?", a: "" },
        1: { q: "What is your monthly average sessions?", a: "" },
        2: { q: "Average order value ($)?", a: "" },
        3: { q: "Estimated Conversion Rate (%)", a: "" },
        4: { q: "New target site speed (seconds)", a: "" },
        5: { q: "What is your industry?", a: "" },
        6: { q: "Enter your email", a: "" },
    }

    const industryOptions = ['yo']

    const [formProgress, setFormProgress] = useState(0);
    const [buttonDisable, setButtonDisable] = useState(true);
    const [answer, setAnswer] = useState('');
    const [answerList, setAnswerList] = useState({});
    const [cmsData, setCmsData] = useState({});


    const notFound =
        formGeneralState.state === "failed" || formQuestionsState.state === "failed";

    let currentQuestion = formQuestionsTest[formProgress].q
    let currentQuestionNum = `${formProgress + 1}.`

    const submitData = async (data) => {
        // Data Submission Logic Here (Usage of API, etc.)
    }

    const handleNextClick = async () => {
        let newAnswerList = {
            ...answerList
        }
        newAnswerList[formProgress] = {}
        newAnswerList[formProgress].q = formQuestionsTest[formProgress].q
        newAnswerList[formProgress].a = answer

        setAnswerList(newAnswerList)
        setFormProgress(formProgress + 1)
        setAnswer('')
        setButtonDisable(true)

        if (formProgress === Object.keys(formQuestionsTest).length - 1) {
            // await submitData(data)
        }
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

    const handleChange = (e) => {
        checkValidity(e)
        setAnswer(e.target.value)
    }

    const checkValidity = (e) => {
        let fieldValue = e.target.value;
        if (fieldValue.length > 0) {
            setButtonDisable(false)
        }
    }


    if (formQuestions && formGeneral) {
        const questionsCMS = filterQuestionData(formQuestions);
        const generalCMS = { ...formGeneral.data }
        console.log(questionsCMS, 'QUESTIONS DATA FILTERED')
        console.log(generalCMS, 'GENERAL DATA')

        return (
            <div className="questions-page">
                <h1 className="questions-title">{`${currentQuestionNum} ${currentQuestion}`}</h1>
                <div className="questions-input-container">
                    {
                        formProgress === 5 ?
                            <select className="questions-input-dropdown" name="industry" defaultValue={industryOptions[0]} onChange={e => handleChange(e)}>
                                {
                                    industryOptions.map((industry, i) =>
                                        <option key={i} value={industry} disabled={i === 0 ? true : false}>{industry}</option>
                                    )
                                }
                            </select>
                            :
                            formProgress >= Object.keys(formQuestionsTest).length - 1
                                ?
                                <input className="questions-input-email" type="email" value={answer} onChange={e => handleChange(e)} />
                                :
                                <input className="questions-input" type="value" value={answer} onChange={e => handleChange(e)} />
                    }
                </div>
                {
                    formProgress >= Object.keys(formQuestionsTest).length - 1 ?
                        <button disabled={buttonDisable} className="questions-next-btn">
                            <Link to='/results' state={answerList}>{testingData.btnText2}</Link>
                        </button>
                        :
                        <button disabled={buttonDisable} className="questions-next-btn" onClick={e => handleNextClick(e)}>
                            {testingData.btnText}
                        </button>
                }
            </div>
        )
    } else if (notFound) {
        return <div>LOADING...</div>
    }

    // return (
    // <div className="questions-page">
    //     <h1 className="questions-title">{`${currentQuestionNum} ${currentQuestion}`}</h1>
    //     <div className="questions-input-container">
    //         {
    //             formProgress === 5 ?
    //             <select className="questions-input-dropdown" name="industry" defaultValue={industryOptions[0]} onChange={e => handleChange(e)}>
    //                 {
    //                     industryOptions.map((industry, i) => 
    //                          <option key={i} value={industry} disabled={i === 0 ? true:false}>{industry}</option>
    //                     )
    //                 }
    //             </select>
    //             :
    //             formProgress >= Object.keys(formQuestionsTest).length - 1 
    //             ?
    //             <input className="questions-input-email" type="email" value={answer} onChange={e => handleChange(e)}/>
    //             :
    //             <input className="questions-input" type="value" value={answer} onChange={e => handleChange(e)}/>
    //         }
    //     </div>
    //     {
    //         formProgress >= Object.keys(formQuestionsTest).length - 1 ?
    //         <button disabled={buttonDisable} className="questions-next-btn">
    //             <Link to='/results' state={answerList}>{testingData.btnText2}</Link>
    //         </button>
    //         :
    //         <button disabled={buttonDisable} className="questions-next-btn" onClick={e => handleNextClick(e)}>
    //             {testingData.btnText}
    //         </button>
    //     }
    // </div>
    // );
}

export default Questions;
