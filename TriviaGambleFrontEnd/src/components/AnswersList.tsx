import { useState, useEffect } from 'react'
import Answer from './Answer'

export default function AnswersList({ currentRound }) {

    const [answers, setAnswers] = useState(["No answers yet"])

    useEffect(() => {
        if (currentRound) {
            setAnswers(currentRound.answers)
        }
    }, [currentRound])

   
    const answersList = answers.map((answer) => (
        <Answer key={answer} answerId={answer}/>
    ))


    return (
        <div>
            {answersList}
        </div>
    )
}