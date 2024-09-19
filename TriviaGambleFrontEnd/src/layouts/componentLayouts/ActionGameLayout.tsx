import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from '../../services/FirestoreService';
import { motion } from "framer-motion";
import { useStore } from "@tanstack/react-store";
import { store } from '../../store'
import Keyboard from "../../components/keyboardComponents/KeyboardLayout";
import AnswerInput from "../../components/inputComponents/AnswerInputLayout";
import CurrentMessage from "../../components/generalComponents/CurrentMessage";
import AnswersList from "../../components/answerComponents/AnswersList";
import { PhaseChangeHelper } from "../../services/PhaseChangeService";
import { MessageHelperService } from "../../services/MessageHelperService";
import { updateHighBet, updateNotIsHighBet } from "../../services/FirestoreService";
import { startNewRound } from "../../services/BackEndService";

export default function ActionGameLayout({ localPlayer, resetTimer, timerOver }) {

    // get gameId to pass into startNewRound method
    const gameId = useParams().gameId

    // bring in game and round state from store
    const currentRound = useStore(store, (state) => state["currentRound"])
    const gameData = useStore(store, (state) => state["game"])

    // state of current High Bet and local player's last bet
    const currentHighBet = currentRound.highBet.bet
    const [lastBet, setLastBet] = useState(0)

    useEffect(() => {
        if (currentHighBet > lastBet) {
            updateNotIsHighBet(localPlayer)
        }
    }, [currentHighBet])

    function getCurrentRoundId() {
        return gameData.rounds[gameData.rounds.length - 1]
    }

    // subscribe to changes in localPlayer doc
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "players", localPlayer), (doc) => {
            if (doc.data()) {
                updateLocalPlayerData(doc.data())
            } else {
                console.log("error retrieving player data in action layout")
            }
        })
        return unsub
    }, [])

    // local player state from store
    const localPlayerData = useStore(store, (state) => state["localPlayer"])
    const updateLocalPlayerData = (playerObj) => {
        store.setState((state) => ({
            ...state,
            ["localPlayer"]: playerObj
        }))
    }

    // // below the phases of game are updated in the store

    const gamePhase = useStore(store, (state) => state["gamePhase"])
    
    PhaseChangeHelper(gamePhase, gameData, currentRound)

    // call backend to start next round when phase changes to startNextRound
    // state ensures that it is only called once

// const [callOnce, setCallOnce] = useState(true)
    useEffect(() => {
        if (gamePhase.startNextRound && localPlayerData.isAnswering) { // isAnswering player is used so that call is only made once
            startNewRound(gameId)                                       // possibly use this to control appeals?
            // if (callOnce) {
            // startNewRound(gameId)
            // setCallOnce(false)
            // console.log('startNewRoundCalled from action layout')
            // }
            // setTimeout(() => setCallOnce(true), 10000)
        }
    }, [gamePhase])

// Controlls whether components are shown or not

    // Answers
    const [showAnswers, setShowAnswers] = useState(false)

    useEffect(() => {
        if (gamePhase.duringAnswering || gamePhase.endAnswering || gamePhase.waitingForJudge) {
            setShowAnswers(true)
        } else if (gamePhase.waitingForCategory || gamePhase.gameEnding) {
            setShowAnswers(false)
        }
    }, [gamePhase])

    // Input
    const [showInput, setShowInput] = useState(false)

    useEffect(() => {
        if (localPlayerData) {
            if ((gamePhase.waitingForCategory && localPlayerData.isJudge) || ((gamePhase.startAnswering || gamePhase.duringAnswering) && localPlayerData.isAnswering)) {
                setShowInput(true)
            } else if (gamePhase.startBetting || gamePhase.endAnswering || gamePhase.waitingForJudge) {
                setShowInput(false)
            }
    }
    }, [gamePhase, localPlayerData])

   
    // Keyboard
    
    const [showKeyboard, setShowKeyboard] = useState(false)

    useEffect(() => {
            if (gamePhase.startBetting || (gamePhase.duringBetting)) { 
                if (!localPlayerData.isJudge) {
                setShowKeyboard(true)          
                }                                                
            } else if (gamePhase.endBetting) {
                setShowKeyboard(false)
            }
    }, [gamePhase])


    // method called up from keyboard to update high bet in GameLayout
    function updateCurrentHighBet(newHighBet: number) {
        const roundId = getCurrentRoundId()
        updateHighBet(roundId, localPlayer, localPlayerData.name, newHighBet)
        setLastBet(newHighBet)
    }

    // Messages

    const messages = MessageHelperService(gamePhase, gameData, localPlayerData, currentRound)

    console.log(gamePhase)

    return (
        <motion.div
            id='action-box'
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
                opacity: [0, 0, 0, 0, 1],
                scale: [.5, .5, .5, .5, 1],
            }}
            transition={{ duration: 1 }}
        >
            {messages}
            {showAnswers && <AnswersList currentRound={currentRound} />}
            {showInput && <AnswerInput resetTimer={resetTimer} timerOver={timerOver} type={localPlayerData?.isJudge ? 'category' : 'answers'} />}
            {showKeyboard && <Keyboard updateCurrentHighBet={updateCurrentHighBet} resetTimer={resetTimer} timerOver={timerOver} highBet={currentHighBet}/>}
        </motion.div>

    )
}