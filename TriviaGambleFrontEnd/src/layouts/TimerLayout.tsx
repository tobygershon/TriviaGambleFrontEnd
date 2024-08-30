import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Timer from "../components/Timer";
import TimerFinal from "../components/TimerSubsequent";

export default function TimerLayout({ resetTimer, handleTimerOver }) {

    const ref = useRef(0)
    const [number, setNumber] = useState(5)
    const [timerOver, setTimerOver] = useState(false)

    useEffect(() => {
        handleTimerOver(timerOver)
    }, [timerOver])

    useEffect(() => {
        startCountdown(5, ref.current)
    }, [resetTimer])

    function countdown(startingNum: number) {
        let currentNum = startingNum
        ref.current = setInterval(() => {
            if (currentNum === 0) {
                setNumber(prevNum => prevNum - 1)
                clearInterval(ref.current)
            } else {
                setNumber(prevNum => prevNum - 1)
                currentNum -= 1
                if (currentNum === 0) {
                    setTimerOver(true)
                }
            }
        }
            , 1000)
    }

    console.log(timerOver)

    function startCountdown(startNum, clearIntRef) {
        if (clearIntRef) {
        clearInterval(clearIntRef)
        setNumber(startNum)
        }
        countdown(startNum)
    }

    return (
        <>
            {number === 5 && <AnimatePresence><Timer number={number} /></AnimatePresence>}
            {number === 4 && <AnimatePresence><Timer number={number} /></AnimatePresence>}
            {number === 3 && <AnimatePresence><Timer number={number} /></AnimatePresence>}
            {number === 2 && <AnimatePresence><Timer number={number} /></AnimatePresence>}
            {number === 1 && <AnimatePresence><Timer number={number} /></AnimatePresence>}
            {number === 0 && <AnimatePresence><Timer number={number} /></AnimatePresence>}
            {number < 0 && <AnimatePresence><TimerFinal number={0} /></AnimatePresence>}
        </>
        
    )
}