import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import TimerLayout from '../../components/timerComponents/TimerLayout'
import Scoreboard from '../../components/headerComponents/Scoreboard'
import { store } from '../../store'
import { useStore } from '@tanstack/react-store'
import { endBetting, endRound } from '../../services/BackEndService'


export default function Header({ gameId, resetTimer, disableSubmit, players }) {

    const [showTimer, setShowTimer] = useState(false)
    const gamePhase = useStore(store, (state) => state["gamePhase"])
    const localPlayerData = useStore(store, (state) => state["localPlayer"])

    useEffect(() => {
        if (gamePhase.duringBetting) {
            if (!localPlayerData.isHighBet && !localPlayerData.isJudge) {
                setShowTimer(true)
            } else {
                setShowTimer(false)
            }
        } else if (gamePhase.duringAnswering && localPlayerData.isAnswering) {
                setShowTimer(true)
        } else {
            setShowTimer(false)  // should set timer to false anytime phase changes and above conditions not met
        }
    }, [gamePhase, localPlayerData])

    // need current round's high bet and highBet player Id

    const highBet = useStore(store, (state) => state["currentRound"].highBet.bet)
    const highBetPlayerId = useStore(store, (state) => state["isHighBet"])

    async function timerOver(isOver: boolean) {
        if (isOver) {
            setTimeout(() => setShowTimer(false), 2800)
            disableSubmit(isOver)
            if (gamePhase.duringBetting) {
                endBetting(gameId, highBetPlayerId, highBet)  
            } else if (gamePhase.duringAnswering) {
                // askForAppeals()   create method to open modal or show div in answers with btn saying 'done w/appeals'
                // appeals should be asked for after timerOver as well as when last 'wrong' judgment comes through but before round is ended
                const response = await endRound(gameId)
                // if (response.status === 'PENDING') {
                //     updateGamePhase(gameId, "waitingForJudge")
                // }
            }
        }
    }

    return (
            
        <motion.nav 
            id='header'
            className="level is-mobile pr-2"
            initial={{ opacity: 0, scale: .7 }}
            animate={{
                opacity: [0, 1, 1, 1, 1],
                scale: [.7, 1, 1, 1, 1]
            }}
            transition={{ duration: 2 }}
            >
                
                <div className="level-item has-text-centered is-flex is-justify-content-left">
                    <div id='logo-box'>
                        { showTimer ? <TimerLayout startNum={10} handleTimerOver={timerOver} resetTimer={resetTimer} /> 
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