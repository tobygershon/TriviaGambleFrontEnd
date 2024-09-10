import { useState, useEffect } from "react"; 
import { motion } from 'framer-motion'
import Button from "../components/GenericButton";
import CurrentMessage from "../components/CurrentMessage";

export default function AnswerInput({ type }) {
    
    const [textInput, setTextInput] = useState("")

    function handleInputChange(event) {
        setTextInput(event.target.value)
    }

    function handleClear() {
        setTextInput('')
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
            <div className="is-flex is-justify-content-center mt-2">
                <Button 
                className='generic-btn'
                text={'Clear'}  
                data={handleClear}
                />
                <Button 
                className='submit-btn'
                text={'Submit'}  
                />
            </div>
            
        </motion.div>
    )
}