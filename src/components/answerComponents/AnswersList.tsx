import { useState, useEffect, useRef } from 'react'
import Answer from './Answer'

export default function AnswersList({ currentRound }) {

    const [answers, setAnswers] = useState(["No answers yet"])
    const [correctCount, setCorrectCount] = useState(0)

    useEffect(() => {
        if (currentRound) {
            setAnswers(currentRound.answers)
        }
    }, [currentRound])

    const highBet = currentRound.highBet.bet

    function incrementCount(num: number) {
        setCorrectCount(prev => prev + num)
    }

    // don't need below b/c checkifroundwon is checked on backend when every judgement is submitted
    // consider checking on front end too and throwing error if not matched up with back end?
    // function checkIfRoundWon() {
    //     if (correctCount >= highBet) {
    //         endRound(gameId)
    //     }
    // }

    // useEffect(() => {
    //     checkIfRoundWon()
    // }, [correctCount])


    const answersList = answers.map((answer, index) => (
        <Answer key={answer} answerId={answer} count={index + 1} incrementCount={incrementCount} />
    ))

    // autoscroll to bottom of div for each new answer submitted

    const listRef = useRef<HTMLDivElement | null>(null)

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