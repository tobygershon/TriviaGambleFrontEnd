import { useState, useEffect, useRef } from 'react'
import Answer from './Answer'

export default function AnswersList({ currentRound }) {

    const [answers, setAnswers] = useState(["No answers yet"])

    useEffect(() => {
        if (currentRound) {
            setAnswers(currentRound.answers)
        }
    }, [currentRound])

    const highBet = currentRound.highBet.bet

    //should this be in useEffect to ensure updates?
    const correctCount = getCorrectAnswersCount()

    function getCorrectAnswersCount() {
        let count = 0;
        for (let answer of answers) {
            if (answer.status === true) {
                count += 1;
            }
        }
        return count;
    }


    const answersList = answers.map((answer, index) => (
        <Answer key={answer} answerId={answer} count={index + 1} />
    ))

    // autoscroll to bottom of div for each new answer submitted

    const listRef = useRef(null)

    useEffect(() => {
        listRef.current?.lastElementChild?.scrollIntoView({behavior: "smooth"})
    }, [answersList])


    return (
        <div id="answers-box">
            <div className="answers-header" ><span className='mr-2'>Answers</span><span>{correctCount} Correct / {highBet} Needed to Win Round</span></div>
            <div className='answers-list' ref={listRef}>
                {answersList}
            </div>
        </div>
    )
}