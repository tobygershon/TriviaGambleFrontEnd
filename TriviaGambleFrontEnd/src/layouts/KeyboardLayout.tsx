import { useState } from "react";
import { motion } from "framer-motion";
import NumberKeyboard from "../components/NumberKeyboardLayout";
import ControlKeyboard from "../components/ControlKeyboardLayout";
import KeyboardInput from "../components/KeyboardInput";

export default function Keyboard() {

    const [keyboardInput, setKeyBoardInput] = useState(0)
    const [lastInput, setLastInput] = useState([0])

    function updateInput(value) {
        if (keyboardInput === 0 && typeof value === "number") {
            setLastInput(prevInput => [...prevInput, keyboardInput])
            setKeyBoardInput(value)
        } else if (typeof value === "number") {
            setLastInput(prevInput => [...prevInput, keyboardInput])
            setKeyBoardInput(prevInput => prevInput * 10 + value)
        } else if (value === 'Back') {
            if (lastInput.length > 0) {
                setKeyBoardInput(lastInput.pop())
            }
        } else if (value === 'Submit') {
            setKeyBoardInput(0)
            setLastInput([0])
        }
        
    }

    return (
        <motion.div
            className='keyboard'
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
        >
            <NumberKeyboard update={updateInput} />
            <ControlKeyboard update={updateInput} />
            <div id='key-input-box'>
                <KeyboardInput num={keyboardInput} />
            </div>

        </motion.div>
    )
}