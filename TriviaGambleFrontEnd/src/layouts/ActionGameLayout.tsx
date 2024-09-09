import { useState, useEffect } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from '../services/FirestoreService';
import { motion } from "framer-motion";
import Keyboard from "./KeyboardLayout";
import AnswerInput from "./AnswerInputLayout";
import CurrentMessage from "../components/CurrentMessage";
import AnswersList from "../components/AnswersList";

export default function ActionGameLayout({ gameData, currentRound, localPlayer, resetTimer, timerOver }) {

    // local player state
    const [localPlayerData, setLocalPlayerData] = useState()

    // subscribe to changes in localPlayer doc
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "players", localPlayer), (doc) => {
            if (doc.data()) {
                setLocalPlayerData(doc.data())
                console.log(doc.data())
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
        waitingForCategory: false, // needs to be updated to true after gameStarting messages are run, as well as after round ends to start next round
        startBetting: false,
        duringBetting: false,
        endBetting: false,
        startAnswering: false, // needs to be updated to true after endBetting messages are run
        duringAnswering: true, // needs to be updated to true after startAnswering messages are run
        endAnswering: false,
        waitingForJudge: false,
        gameEnding: false
    })

    console.log(gamePhase)

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


    // logic to determine game phase.  effects run when gameData or currentRound change

    useEffect(() => {
        // phase where hasStarted changed to true
        if (gamePhase.beforeStart && gameData.hasStarted) {
            setGamePhase(prev => ({
                ...prev,
                beforeStart: false,
                gameStarting: true
            }))
        }

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
        if (currentRound) {
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
                    startBetting: false,
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
        }
    }, [currentRound])

    // controls whether components are being shown or not

    // Answers
    const [showAnswers, setShowAnswers] = useState(false)

    useEffect(() => {
        if (gamePhase.duringAnswering || gamePhase.endAnswering || gamePhase.waitingForJudge) {
            setShowAnswers(true)
        } else if (showAnswers === true) {
            setShowAnswers(false)
        }
    }, [gamePhase])

    // Input
    const [showInput, setShowInput] = useState(false)

    useEffect(() => {
        if (localPlayerData) {
            console.log('phase: ' + gamePhase.waitingForCategory + ' is Judge: ' + localPlayerData.isJudge)
            if ((gamePhase.waitingForCategory && localPlayerData.isJudge) || ((gamePhase.startAnswering || gamePhase.duringAnswering) && localPlayerData.isAnswering)) {
                setShowInput(true)
            } else if (showInput === true) {
                setShowInput(false)
            }
    }
    }, [gamePhase, localPlayerData])

   

    // Keyboard
    const [showKeyboard, setShowKeyboard] = useState(false)

    useEffect(() => {
        if (localPlayerData) {
            if (gamePhase.startBetting || (gamePhase.duringBetting)) { //&& localPlayerData.isHighBet)) {  //consider leaving keyboard showing
                setShowKeyboard(true)                                                           // during betting, just disable submit button
            } else if (showKeyboard === true) {                                                 // instead of removing and showing keyboard over and over
                setShowKeyboard(false)
            }
    }
    }, [gamePhase, localPlayerData])

    // for currentMessage component, an array of current messages are looped through for different scenarios

    const [messageArray, setMessageArray] = useState(["...Waiting for Players to Join"])
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

    useEffect(() => {
        const msgArrayLength = messageArray.length;
        let msgIndex = 0;
        const cancelRef = setInterval(() => {

            if (msgIndex < msgArrayLength) {
                setCurrentMessageIndex(prev => prev + 1)
                msgIndex += 1
                if (msgIndex === msgArrayLength) {
                    clearInterval(cancelRef)
                }
            }
        }, 3000)
    }, [])


    const messages = messageArray.map((message, index) => (
        currentMessageIndex === index &&
        <CurrentMessage
            key={index}
            message={message}
            gamePhase={gamePhase}
            gameData={gameData}
            currentRound={currentRound}
            localPlayer={localPlayerData}
        />
    ))


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
            {messages}
            {showAnswers && <AnswersList currentRound={currentRound} />}
            {showInput && <AnswerInput type={localPlayerData?.isJudge ? 'category' : 'answers'} />}
            {showKeyboard && <Keyboard resetTimer={resetTimer} timerOver={timerOver} />}
        </motion.div>

    )
}