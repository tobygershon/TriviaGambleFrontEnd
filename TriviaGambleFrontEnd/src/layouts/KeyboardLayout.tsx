import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NumberKeyboard from "../components/NumberKeyboardLayout";
import ControlKeyboard from "../components/ControlKeyboardLayout";
import CurrentMessage from "../components/CurrentMessage";

export default function Keyboard({ isHighBet, highBetData, resetTimer, timerOver }) {

    const [keyboardInput, setKeyBoardInput] = useState(0)
    const [lastInput, setLastInput] = useState([0])

    const [highBet, setHighBet] = useState(false)
    const [message, setMessage] = useState("Place Your Bet!")
    const [currentHighBet, setCurrentHighBet] = useState({})

    useEffect(() => {
        setHighBet(isHighBet)
    }, [isHighBet])

    useEffect(() => {
        setCurrentHighBet(highBetData)
    }, [highBetData])

    useEffect(() => {
        if (isHighBet) {
            setMessage("You are the high bet! ...Waiting for a counter-bet")
        } else {
            setMessage(`Do you want to bet more than ${currentHighBet.bet}?`)
        }
    }, [isHighBet])

    function updateInput(value) {
            if (keyboardInput === 0 && typeof value === "number") {
                setLastInput(prevInput => [...prevInput, keyboardInput])
                setKeyBoardInput(value)
            } else if (typeof value === "number" && keyboardInput.toString().length < 2) {
                setLastInput(prevInput => [...prevInput, keyboardInput])
                setKeyBoardInput(prevInput => prevInput * 10 + value)
            } else if (value === 'Back') {
                if (lastInput.length > 0) {
                    setKeyBoardInput(lastInput.pop())
                }
            } else if (value === 'Submit') {
                setKeyBoardInput(0)
                setLastInput([0])
                resetTimer()
            }
    }

    return (
        <motion.div
            className='keyboard'
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 5 }}
        >
            <CurrentMessage message={message} endingOpacity={true}/>
            <NumberKeyboard update={updateInput} />
            <ControlKeyboard currentNum={keyboardInput} update={updateInput} timerOver={timerOver} />

        </motion.div>
    )
}