import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NumberKeyboard from "./NumberKeyboardLayout";
import ControlKeyboard from "./ControlKeyboardLayout";
import CurrentMessage from "../generalComponents/CurrentMessage";
import { useParams } from "react-router-dom";
import { store } from "../../store";
import { useStore } from "@tanstack/react-store";
import { endBetting } from "../../services/BackEndService";

export default function Keyboard({ resetTimer, timerOver, updateCurrentHighBet, highBet }) {

    const [keyboardInput, setKeyBoardInput] = useState(0)
    const [lastInput, setLastInput] = useState([0])
    const gameId = useParams().gameId
    const highBetPlayerId = useStore(store, (state) => state["isHighBet"])


    function updateInput(value) {
            if (keyboardInput === 0 && typeof value === "number") {
                setLastInput(prevInput => [...prevInput, keyboardInput])
                setKeyBoardInput(value)
            } else if (typeof value === "number" && keyboardInput.toString().length < 2) {
                setLastInput(prevInput => [...prevInput, keyboardInput])
                setKeyBoardInput(prevInput => prevInput * 10 + value)
            } else if (value === 'back-btn') {
                if (lastInput.length > 0) {
                    setKeyBoardInput(lastInput.pop())
                }
            } else if (value === 'submit-btn') {
                setKeyBoardInput(0)
                setLastInput([0])
                if (checkIfNewBetIsHigher()) {
                    resetTimer()
                    // update new high bet in frontend
                    updateCurrentHighBet(keyboardInput)
                    updateMessage(['Good Bet!'])
                } else {
                    updateMessage([`You need to bet more than ${highBet}`])
                } 
            } else if (keyboardInput === 0) {
                endBetting(gameId, highBetPlayerId, highBet)   // this is case where person betting gives up and lets the high bet person try to answer
            }
        }


    const checkIfNewBetIsHigher = () => keyboardInput > highBet ? true : false;
    const updateMessage = (message) => {
        store.setState((state) => ({
            ...state,
            ["currentMessage"]: [message]
        }))
    }

    return (
        <motion.div
            id='keyboard'
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2 }}
        >
            <NumberKeyboard update={updateInput} firstNum={0} lastNum={5}/>
            <NumberKeyboard update={updateInput} firstNum={5} lastNum={10}/>
            <ControlKeyboard currentNum={keyboardInput} update={updateInput} timerOver={timerOver} highBet={highBet} />

        </motion.div>
    )
}