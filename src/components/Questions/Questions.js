import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './Questions.css';

function Questions() {
    const cmsData = {
        btnText: "Next",
        btnText2: "View your results"
    }

    const formQuestions = {
        0:{q:"What is your current site speed (seconds)?", a:""},
        1:{q:"What is your monthly average sessions?", a:""},
        2:{q:"Average order value ($)?", a:""},
        3:{q:"Estimated Conversion Rate (%)", a:""},
        4:{q:"New target site speed (seconds)", a:""},
        5:{q:"What is your industry?", a:""},
        6:{q:"Enter your email", a:""},
    }

    const industryOptions = ["Select Industry", "Arts and Crafts", "Electrical and Commercial Equipment", "Pet Care", "Health and Wellbeing", "Kitchen and Home Appliances", "Home Accessories and Giftware", "Cars and Motorcycling", "Fashion, Clothing, and Accessories", "Sports and Recreation"]

    const [formProgress, setFormProgress] = useState(0);
    const [buttonDisable, setButtonDisable] = useState(true);
    const [answer, setAnswer] = useState('');
    const [answerList, setAnswerList] = useState({})

    let currentQuestion = formQuestions[formProgress].q
    let currentQuestionNum = `${formProgress + 1}.`

    const handleNextClick = () => {
        let newAnswerList = {
            ...answerList
        }
        newAnswerList[formProgress] = {}
        newAnswerList[formProgress].q = formQuestions[formProgress].q
        newAnswerList[formProgress].a = answer

        setAnswerList(newAnswerList)
        setFormProgress(formProgress + 1)
        setAnswer('')
        setButtonDisable(true)
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
 
    return (
        <div className="questions-page">
            <h1 className="questions-title">{`${currentQuestionNum} ${currentQuestion}`}</h1>
            <div className="questions-input-container">
                {
                    formProgress === 5 ?
                    <select className="questions-input-dropdown" name="industry" defaultValue={industryOptions[0]} onChange={e => handleChange(e)}>
                        {
                            industryOptions.map((industry, i) => 
                                 <option key={i} value={industry} disabled={i === 0 ? true:false}>{industry}</option>
                            )
                        }
                    </select>
                    :
                    formProgress >= Object.keys(formQuestions).length - 1 
                    ?
                    <input className="questions-input-email" type="email" value={answer} onChange={e => handleChange(e)}/>
                    :
                    <input className="questions-input" type="value" value={answer} onChange={e => handleChange(e)}/>
                }
            </div>
            {
                formProgress >= Object.keys(formQuestions).length - 1 ?
                <button disabled={buttonDisable} className="questions-next-btn">
                    <Link to='/results' state={answerList}>{cmsData.btnText2}</Link>
                </button>
                :
                <button disabled={buttonDisable} className="questions-next-btn" onClick={e => handleNextClick(e)}>
                    {cmsData.btnText}
                </button>
            }
        </div>
    );
}

export default Questions;
