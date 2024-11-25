import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Timer from "./Timer";
import TimerFinal from "./TimerSubsequent";

export default function TimerLayout({ resetTimer, handleTimerOver, startNum }) {

    const ref = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [number, setNumber] = useState<number>(startNum)
    const [timerOver, setTimerOver] = useState(false)

    useEffect(() => {
        if (timerOver) {
            handleTimerOver(timerOver)
            setTimerOver(false)
        }
    }, [timerOver])

    useEffect(() => {
        startCountdown(startNum, ref.current)
    }, [resetTimer])

    function countdown(startingNum: number) {
        let currentNum = startingNum
        ref.current = setInterval(() => {
            if (currentNum === 0) {
                setNumber(prevNum => prevNum - 1)
                if (ref.current !== null) {
                clearInterval(ref.current)
                }
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

    function startCountdown(startNum, clearIntRef) {
        if (clearIntRef) {
        clearInterval(clearIntRef)
        setNumber(startNum)
        }
        countdown(startNum)
    }

    if (startNum === 7) {
        return (
            <>
                {number === 7 && <AnimatePresence><Timer number={number} /></AnimatePresence>}
                {number === 6 && <AnimatePresence><Timer number={number} /></AnimatePresence>}
                {number === 5 && <AnimatePresence><Timer number={number} /></AnimatePresence>}
                {number === 4 && <AnimatePresence><Timer number={number} /></AnimatePresence>}
                {number === 3 && <AnimatePresence><Timer number={number} /></AnimatePresence>}
                {number === 2 && <AnimatePresence><Timer number={number} /></AnimatePresence>}
                {number === 1 && <AnimatePresence><Timer number={number} /></AnimatePresence>}
                {number === 0 && <AnimatePresence><Timer number={number} /></AnimatePresence>}
                {number < 0 && <AnimatePresence><TimerFinal number={0} /></AnimatePresence>}
            </>
        )
    } else if (startNum === 10) {
        return (
            <>
                {number === 10 && <AnimatePresence><Timer number={number} /></AnimatePresence>}
                {number === 9 && <AnimatePresence><Timer number={number} /></AnimatePresence>}
                {number === 8 && <AnimatePresence><Timer number={number} /></AnimatePresence>}
                {number === 7 && <AnimatePresence><Timer number={number} /></AnimatePresence>}
                {number === 6 && <AnimatePresence><Timer number={number} /></AnimatePresence>}
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
    
}