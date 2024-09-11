import { useState, useEffect, useRef } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from '../services/FirestoreService';
import { motion } from "framer-motion";
import Keyboard from "./KeyboardLayout";
import AnswerInput from "./AnswerInputLayout";
import CurrentMessage from "../components/CurrentMessage";
import AnswersList from "../components/AnswersList";
import { useStore } from "@tanstack/react-store";
import { store } from '../store'
import { updateHighBet } from "../services/FirestoreService";

export default function ActionGameLayout({ localPlayer, resetTimer, timerOver }) {

    // bring in game and round state from store
    const currentRound = useStore(store, (state) => state["currentRound"])
    const gameData = useStore(store, (state) => state["game"])

    function getCurrentRoundId() {
        return gameData.rounds[gameData.rounds.length - 1]
    }

    // local player state from store
    const localPlayerData = useStore(store, (state) => state["localPlayer"])
    const updateLocalPlayerData = (playerObj) => {
        store.setState((state) => ({
            ...state,
            ["localPlayer"]: playerObj
        }))
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

    // below the phases of game are updated in the store

    const gamePhase = useStore(store, (state) => state["gamePhase"])

    const updatePhase = (phase1: string, phase2: string) => {
        store.setState((state) => ({
            ...state,
            ["gamePhase"]: {
                ...state["gamePhase"],
                [phase1]: false,
                [phase2]: true,
            },
        })
        )}

    // logic to determine game phase.  effects run when gameData or currentRound change

    useEffect(() => {
        // phase where hasStarted changed to true
        if (gamePhase.beforeStart && gameData.hasStarted) {
            updatePhase("beforeStart", "gameStarting")
        }
        // change to end game phase
        if (gamePhase.endAnswering && gameData.hasEnded) { // or gamePhase.waitingForJudge instead of endAnswering
            updatePhase("endAnswering", "gameEnding")
        }
        }, [gameData])

    useEffect(() => {
        // starting betting after category is submitted
            if (gamePhase.waitingForCategory && currentRound.isBetting) {
                updatePhase("waitingForCategory", "startBetting")
            }
            // change to during betting after a bet is submitted
            if (gamePhase.startBetting && currentRound.highBet.bet !== 0) {
                updatePhase("startBetting", "duringBetting")
            }
            // change to end betting phase when isBetting is updated to false
            if (gamePhase.duringBetting && !currentRound.isBetting) {
                updatePhase("duringBetting", "endBetting")
            }

            // change to endAnswering phase after round isOver
            if (gamePhase.duringAnswering && currentRound.isOver) {
                updatePhase("duringAnswering", "endAnswering")
            }
    }, [currentRound])

    // controls whether components are being shown or not

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
            } else if (gamePhase.startBetting || gamePhase.endAnswering) {
                setShowInput(false)
            }
    }
    }, [gamePhase, localPlayerData])

   
    // Keyboard
    
    const [showKeyboard, setShowKeyboard] = useState(true)
    const currentHighBet = currentRound.highBet.bet

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
    function updateCurrentHighBet(newHighBet) {
        const roundId = getCurrentRoundId()
        updateHighBet(roundId, localPlayerData.name, newHighBet)
    }

    // Messages

    const messageArray = useStore(store, (state) => state["currentMessage"])
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0)       // index to control which message is rendering
    const messageArrayLength = useRef(0)

    const setMessageArray = (msgArray) => {
        store.setState((state) => ({
            ...state,
            ["currentMessage"]: msgArray
        }))
    }

    console.log(messageArray)
    console.log(currentHighBet)

      // renders array of current messages

     const messages = messageArray.map((message, index) => (
         currentMessageIndex === index &&
         <CurrentMessage
              key={index}
              message={message}
              endingOpacity={index === messageArrayLength.current - 1 ? true : false}
          />
      ))

    //effect loops through current message array and renders subsequent components every 3sec

    useEffect(() => {
        setCurrentMessageIndex(0)
        messageArrayLength.current = messages.length

        let msgIndex = 0;
        const cancelRef = setInterval(() => {
            if (msgIndex < messageArrayLength.current) {
                msgIndex += 1
                if (msgIndex === messageArrayLength.current) {
                    clearInterval(cancelRef)
                } else {
                    setCurrentMessageIndex(prev => prev + 1)
                }
            }
        }, 5000)
    }, [messageArray])

    // for currentMessage component, an array of current messages are looped through for different scenarios

    const beforeStartMsg = ["Waiting for players to join ..."]
    const gameStartingMsgs = ["All Players Have Joined!", "The Game is Ready to Start!", "Get Ready for the First Category..."]
    const waitingForCategoryJudgeMsgs = ["You are the judge for this round!", "Please create a category for the round..."]
    const waitingForCategoryMsgs = ["Please wait for this round's judge to create a category", "waiting for the category..."]
    const startBettingMsgs = currentRound ? [`This round's category is ${currentRound.category}!`, `How many ${currentRound.category} do you think you can think of?`, "Get Ready to Bet!", "Start Betting!"]
                                        : [`This round's category is chosen!`, "...waiting to load"]
    const duringBettingMsgs =["Either bet higher, or let your opponent try to match their bet"]
    const endBettingMsgs = currentRound ? ["The betting is over!", `${currentRound.highBet.player} has the high bet of ${currentRound.highBet.bet}!`]
                                        : ["The betting is over!", `...determining high bet`]
    const startAnsweringHighBetMsgs = ["Get ready to start answering!", "Get set!", "Go! Start entering your answers"]
    const startAnsweringMsgs = currentRound ? [`${currentRound.highBet.player} is getting ready to start answering...`]
                                            : [`getting ready to start answering...`]
    const duringAnsweringMsgs = [""]
    // const endAnsweringWinningMsgs = ["The Timer is Over!", `Great Job ${currentRound.highBet.player}!`, `You got ${currentRound.highBet.bet} answers correct!`, "You win a point for the round!"]
    // const endAnsweringLosingMsgs = ["The Timer is Over!", `Sorry ${currentRound.highBet.player}, you couldn't reach ${currentRound.highBet.bet} answers`, "Your opponent gets a point for the round"]
    const waitingForJudgeMsgs = ["We are waiting for the judge to to determine if some answers are correct..."]
    const gameEndingMsgs = ["The Game is Over!", `Congratulations ${gameData.winner}! You win with ${gameData.endingScore} points!`]

    useEffect(() => {
        if (gamePhase.gameStarting) {
            setMessageArray(gameStartingMsgs)
        } else if (gamePhase.waitingForCategory) {
            if (localPlayerData) {
                if (localPlayerData.isJudge) {
                    setMessageArray(waitingForCategoryJudgeMsgs)
                } else {
                    setMessageArray(waitingForCategoryMsgs)
                }
            }
        } else if (gamePhase.startBetting) {
            setMessageArray(startBettingMsgs)
        } else if (gamePhase.duringBetting) {
            setMessageArray(duringBettingMsgs)
        } else if (gamePhase.endBetting) {
            setMessageArray(endBettingMsgs)
        } else if (gamePhase.startAnswering) {
            if (localPlayerData) {
                if (localPlayerData.isAnswering) {
                    setMessageArray(startAnsweringHighBetMsgs)
                } else {
                    setMessageArray(startAnsweringMsgs)
                }
            }
        } else if (gamePhase.duringAnswering) {
            setMessageArray(duringAnsweringMsgs)
        } else if (gamePhase.endAnswering) {
            // need conditional logic to set msg based on if wins or loses
        } else if (gamePhase.waitingForJudge) {
            setMessageArray(waitingForJudgeMsgs)
        } else if (gamePhase.gameEnding) {
            setMessageArray(gameEndingMsgs)
        } else {
            console.log("something went wrong setting messages")
        }
    }, [gamePhase])

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