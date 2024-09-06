import { useState, useEffect } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from '../services/FirestoreService'
import { FlatTree, motion } from "framer-motion";
import Keyboard from "./KeyboardLayout";
import AnswerInput from "./AnswerInputLayout";
import CurrentMessage from "../components/CurrentMessage";
import AnswersList from "../components/AnswersList";

export default function ActionGameLayout( { gameData, currentRound, localPlayer, resetTimer, timerOver} ) {

    // local player state
    const [localPlayerData, setLocalPlayerData] = useState()

    // subscribe to changes in localPlayer doc
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "players", localPlayer), (snapshot) => {
            if (snapshot.data()) {
                setLocalPlayerData(snapshot.data())
            } else {
                console.log("error retrieving player data in action layout")
            }
        })
        return unsub
    }, [])

    // below are phases of game

    const [gamePhase, setGamePhase] = useState({
        beforeStart: true,
        gameStarting: false,
        waitingForCategory: false, // needs to be updated to true after gameStarting messages are run
        startBetting: false,
        duringBetting: false,
        endBetting: false, 
        startAnswering: false, // needs to be updated to true after endBetting messages are run
        duringAnswering: false, // needs to be updated to true after startAnswering messages are run
        endAnswering: false,
        // waitingForJudge: false,
        gameEnding: false
    })

    // const [beforeStart, setBeforeStart] = useState(true)
    // const [gameStarting, setGameStarting] = useState(false)
    // const [waitingForCategory, setWaitingForCategory] = useState(false)
    // const [startBetting, setStartBetting] = useState(false)
    // const [duringBetting, setDuringBetting] = useState(false)
    // const [endBetting, setEndBetting] = useState(false)
    // const [startAnswering, setStartAnswering] = useState(false)
    // const [duringAnswering, setDuringAnswering] = useState(false)
    // const [endAnswering, setEndAnswering] = useState(false)
    // const [waitingForJudge, setWaitingForJudge] = useState(false)

    
    // logic to determine game phase

    useEffect(() => {
        // phase where hasStarted changed to true
        if (gamePhase.beforeStart && gameData.hasStarted) {
            setGamePhase(prev => ({
                ...prev,
                beforeStart: false,
                gameStarting: true
            }))}

        // change to end game phase
        if (gamePhase.endAnswering && gameData.hasEnded) { // or gamePhase.waitingForJudge instead of endAnswering
            setGamePhase(prev => ({
                ...prev,
                endAnswering: false,
                gameEnding: true
            }))
        }
        }, [gameData])
    
    useEffect(() => {
        // starting betting after category is submitted
        if (gamePhase.waitingForCategory && currentRound.isBetting) {
                setGamePhase(prev => ({
                    ...prev,
                    waitingForCategory: false,
                    startBetting: true
                }))
            }
        
            // change to during betting after a bet is submitted
        if (gamePhase.startBetting && currentRound.highBet.bet !== 0) {
            setGamePhase(prev => ({
                ...prev,
                startBetting:false,
                duringBetting: true
            }))
        }

        // change to end betting phase when isBetting is updated to false
        if (gamePhase.duringBetting && !currentRound.isBetting) {
            setGamePhase(prev => ({
                ...prev,
                duringBetting: false,
                endBetting: true
            }))
        }

        // change to endAnswering phase after round isOver
        if (gamePhase.duringAnswering && currentRound.isOver) {
            setGamePhase(prev => ({
                ...prev,
                duringAnswering: false,
                endAnswering: true
            }))
        }
    }, [currentRound])
        
        

    // controls whether components are being shown or not

    // message
    const [showMessage, setShowMessage] = useState(true)
    const toggleMessage = () => (setShowMessage(prev => !prev))

    // Answers
    const [showAnswers, setShowAnswers] = useState(false)
    const toggleAnswers = () => (setShowAnswers(prev => !prev))

    // Input
    const [showInput, setShowInput] = useState(false)
    const toggleInput = () => (setShowInput(prev => !prev))

    // Keyboard
    const [showKeyboard, setShowKeyboard] = useState(false)
    const toggleKeyboard = () => (setShowKeyboard(prev => !prev))


    return (
        <motion.div
        id='action-box'
        initial={{ opacity: 0, scale: 0.5 }}
            animate={{
                opacity: [0, 0, 0, 0, 1],
                scale: [.5, .5, .5, .5, 1],
            }}
            transition={{ duration: 2 }}
        >
            {showMessage && <CurrentMessage phase={gamePhase} gameData={gameData} currentRound={currentRound} localPlayer={localPlayerData} toggleMessage={toggleMessage} />}
            {showAnswers && <AnswersList currentRound={currentRound} />}
            {showInput && <AnswerInput type={localPlayerData?.isJudge ? 'category' : 'answers'} />}
            {showKeyboard && <Keyboard resetTimer={resetTimer} timerOver={timerOver}/>}
        </motion.div>

    )
}