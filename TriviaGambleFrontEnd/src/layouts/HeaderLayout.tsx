import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import TimerLayout from './TimerLayout'
import Scoreboard from '../components/Scoreboard'
import { store } from '../store'
import { useStore } from '@tanstack/react-store'


export default function Header({ resetTimer, disableSubmit, players }) {

    const [showTimer, setShowTimer] = useState(false)
    const gamePhase = useStore(store, (state) => state["gamePhase"])

    useEffect(() => {
        if (gamePhase.duringAnswering || gamePhase.duringBetting) {
            setShowTimer(true)
        }
    }, [gamePhase])

    function timerOver(isOver: boolean) {
        if (isOver) {
            setTimeout(() => setShowTimer(false), 2800)
            disableSubmit(isOver)
        }
    }

    return (
            
        <motion.nav 
            id='header'
            className="level is-mobile"
            initial={{ opacity: 0, scale: .7 }}
            animate={{
                opacity: [0, 1, 1, 1, 1],
                scale: [.7, 1, 1, 1, 1]
            }}
            transition={{ duration: 2 }}
            >
                
                <div className="level-item has-text-centered is-flex is-justify-content-left">
                    <div id='logo-box'>
                        { showTimer ? <TimerLayout handleTimerOver={timerOver} resetTimer={resetTimer} /> 
                        : <motion.img 
                            id='logo-img' 
                            src='/T.png' 
                            alt="logo" 
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 2}}/> }
                    </div>
                </div>
            
                <Scoreboard players={players}/>
            
        </motion.nav>
    )
}