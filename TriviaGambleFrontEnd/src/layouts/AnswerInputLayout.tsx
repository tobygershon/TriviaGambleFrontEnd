import { useState, useEffect } from "react"; 
import { motion } from 'framer-motion'
import Button from "../components/GenericButton";
import CurrentMessage from "../components/CurrentMessage";

export default function AnswerInput({ type, resetTimer, timerOver }) {
    
    const [textInput, setTextInput] = useState("")

    function handleInputChange(event) {
        setTextInput(event.target.value)
    }

    function handleClear() {
        setTextInput('')
    }

    function handleSubmit() {
        if (type === 'category' && textInput.trim().length > 0) {
            // call backend for judge to set category
            handleClear()
        } else if (type === 'answers' && textInput.trim().length > 0) {
            // call backend to submit answer
            handleClear()
            resetTimer()
        } else {
            // set msg to say theres a problem?
            console.log('There was a problem with the type for the answer input submit')
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