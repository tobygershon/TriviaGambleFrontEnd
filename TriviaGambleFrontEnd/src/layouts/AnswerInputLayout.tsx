import { useState, useEffect } from "react"; 
import { useParams } from "react-router-dom";
import { motion } from 'framer-motion'
import Button from "../components/GenericButton";
import { createNewCategory, addAnswer } from "../services/BackEndService";

export default function AnswerInput({ type, resetTimer, timerOver }) {

    const gameId = useParams().gameId
    const [textInput, setTextInput] = useState("")

    function handleInputChange(event) {
        setTextInput(event.target.value)
    }

    function handleClear() {
        setTextInput('')
    }

    function handleSubmit(value) {
        if (type === 'category' && textInput.trim().length > 0) {
            createNewCategory(gameId, textInput)
            handleClear()
            console.log('type from category: ' + value)
        } else if (type === 'answers' && textInput.trim().length > 0) {
            addAnswer(gameId, textInput)
            handleClear()
            resetTimer()
            console.log('type from answers: ' + value)
        } else {
            // set msg to say theres a problem?
            console.log('There was a problem with the type for the answer input submit, or submitted text length of 0')
        }
    }

   

    return (
        <motion.div
            id='answer-input'>
            <input 
                className='text-input' 
                type='text' 
                placeholder={type === 'category' ? "Choose a Category" : "Type Answers Here"}
                name="textInput" 
                value={textInput} 
                onChange={handleInputChange}
                autoFocus/>
            <div className="is-flex is-justify-content-space-evenly">
                <Button 
                btnType='back-btn'
                text={'Clear'}  
                data={handleClear}
                />
                <Button 
                btnType='submit-btn'
                text={'Submit'}
                data={handleSubmit}
                timerOver={timerOver}
                />
            </div>
            
        </motion.div>
    )
}