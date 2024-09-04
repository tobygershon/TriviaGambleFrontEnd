import { useState, useEffect } from "react"; 
import { motion } from 'framer-motion'
import Button from "../components/GenericButton";

export default function AnswerInput() {
    
    const [textInput, setTextInput] = useState("")

    function handleInputChange(event) {
        setTextInput(event.target.value)
    }

    function handleClear() {
        setTextInput('')
    }

    console.log(textInput)

    return (
        <motion.div
            id='answer-input'>
            <input 
                className='text-input' 
                type='text' 
                placeholder="Type Answers Here" 
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