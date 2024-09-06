import { useState, useEffect } from 'react'
import Answer from './Answer'

export default function AnswersList({ currentRound }) {


   
    
    const answers = currentRound.answers.map((answer) => (
        <Answer key={answer} answerId={answer}/>
    ))

    return (
        <div>
            {answers}
        </div>
    )
}