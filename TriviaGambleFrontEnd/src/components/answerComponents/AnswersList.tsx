import { useState, useEffect } from 'react'
import Answer from './Answer'

export default function AnswersList({ currentRound }) {

    const [answers, setAnswers] = useState(["No answers yet"])

    useEffect(() => {
        if (currentRound) {
            setAnswers(currentRound.answers)
        }
    }, [currentRound])


    const answersList = answers.map((answer, index) => (
        <Answer key={answer} answerId={answer} count={index + 1} />
    ))


    return (
        <div id="answers-box">
            <div className='answers-list'>
                {answersList}
            </div>
        </div>
    )
}