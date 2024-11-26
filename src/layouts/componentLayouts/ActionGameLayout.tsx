import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
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
import { updateGamePhase } from "../../services/BackEndService"

export default function ActionGameLayout({ localPlayer, resetTimer, timerOver }) {

    // get gameId to pass into startNewRound method
    const gameId = useParams().gameId

    // update game phases in store
    PhaseChangeHelper()


    // bring in game, localPlayer and current round state from store
    const currentRound = useStore(store, (state) => state["currentRound"])
    const gameData = useStore(store, (state) => state["game"])
    const localPlayerData = useStore(store, (state) => state["localPlayer"])

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

    // // below the phases of game are updated in the store

    const gamePhase = useStore(store, (state) => state["gamePhase"])

    // call backend to start next round when phase changes to startNextRound
    // state ensures that it is only called once

    // const [callOnce, setCallOnce] = useState(true)
    useEffect(() => {
        if (gamePhase.startNextRound && localPlayerData.isAnswering) { // isAnswering player is used so that call is only made once
            if (gameId) {
                startNewRound(gameId)
            }                                    // possibly use this to control appeals?
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



    // update Messages
    MessageHelperService(gamePhase, currentRound, gameData, localPlayerData)

    const messageArray = useStore(store, (state) => state["currentMessage"])
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0)       // index to control which message is rendering
    const cancelRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // renders array of current message

    const messages = messageArray.map((message, index) => {
        const messageArrayLength = messageArray.length
        if (message) {
            return currentMessageIndex === index &&
                <CurrentMessage
                    key={index}
                    message={message}
                    endingOpacity={index === messageArrayLength - 1 ? true : false}
                />
        } else {
            return currentMessageIndex === index && updatePhaseFromMsgArrayEnding()
        }
    })

    //effect loops through current message array and renders subsequent components every 3sec

    useEffect(() => {
        if (cancelRef.current) {
            clearInterval(cancelRef.current)
        }
        setCurrentMessageIndex(0)
        const messageArrayLength = messageArray.length

        let msgIndex = 0;
        cancelRef.current = setInterval(() => {
            if (msgIndex < messageArrayLength) {
                msgIndex += 1
                if (msgIndex === messageArrayLength) {
                    if (cancelRef.current) {
                        clearInterval(cancelRef.current)
                    }
                } else {
                    setCurrentMessageIndex(prev => prev + 1)
                }
            }
        }, 3000)
    }, [messageArray])



    // Below method updates phase when certain messages are finished running

    function updatePhaseFromMsgArrayEnding() {
        if (localPlayerData.isJudge) {  // judge will be only player calling backend so that only 1 call is made
            if (gameId) {
                if (gamePhase.gameStarting) {
                    updateGamePhase(gameId, "waitingForCategory")
                } else if (gamePhase.endBetting) {
                    updateGamePhase(gameId, "duringAnswering")
                } else if (gamePhase.endAnswering && !gameData.hasEnded) {  // not sure if !gameData.hasEnded is necessary here, but just in case
                    updateGamePhase(gameId, "startNextRound")
                }
            }
        }
    }


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
            {messages ? messages : ""}
            {showAnswers && <AnswersList currentRound={currentRound} />}
            {showInput && <AnswerInput resetTimer={resetTimer} timerOver={timerOver} type={localPlayerData?.isJudge ? 'category' : 'answers'} />}
            {showKeyboard && <Keyboard updateCurrentHighBet={updateCurrentHighBet} resetTimer={resetTimer} timerOver={timerOver} highBet={currentHighBet} />}
        </motion.div>

    )
}