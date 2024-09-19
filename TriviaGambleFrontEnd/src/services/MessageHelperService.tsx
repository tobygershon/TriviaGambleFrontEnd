import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { store } from "../store"
import { useStore } from "@tanstack/react-store"
import CurrentMessage from "../components/generalComponents/CurrentMessage"
// import { updatePhase } from "./PhaseChangeService"
import { updateGamePhase } from "./BackEndService"

export const MessageHelperService = (gamePhase, gameData, localPlayerData, currentRound) => {

    //gameId from params
    const gameId = useParams().gameId

    // need state from store for currentRound wonRound
    const wonRound = useStore(store, (state) => state["currentRound"].wonRound)

    const messageArray = useStore(store, (state) => state["currentMessage"])
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0)       // index to control which message is rendering
    const messageArrayLength = useRef(0)

    const setMessageArray = (msgArray) => {
        store.setState((state) => ({
            ...state,
            ["currentMessage"]: msgArray
        }))
    }

      // renders array of current messages

     const messages = messageArray.map((message, index) => {
        if (message) {
        return currentMessageIndex === index &&
                            <CurrentMessage
                                key={index}
                                message={message}
                                endingOpacity={index === messageArrayLength.current - 1 ? true : false}
                            />
        } else {
            return currentMessageIndex === index && updatePhaseFromMsgArrayEnding()
        }
      })

          // Below method updates phase when certain messages are finished running

    function updatePhaseFromMsgArrayEnding() {
        if (localPlayerData.isJudge) {  // judge will be only player calling backend so that only 1 call is made
            if (gamePhase.gameStarting) {
                updateGamePhase(gameId, "waitingForCategory")
            } else if (gamePhase.endBetting) {
                updateGamePhase(gameId, "duringAnswering")
            } else if (gamePhase.endAnswering && !gameData.hasEnded) {  // not sure if !gameData.hasEnded is necessary here, but just in case
                updateGamePhase(gameId, "startNextRound")
            } 
        }
    }

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

    const gameStartingMsgs = ["All Players Have Joined!", "The Game is Ready to Start!", "Get Ready for the First Category...", false]
    const waitingForCategoryJudgeMsgs = ["You are the judge for this round!", "Please create a category for the round..."]
    const waitingForCategoryMsgs = ["Please wait for this round's judge to create a category", "waiting for the category..."]
    const startBettingMsgs = [`This round's category is ${currentRound.category}!`, `How many ${currentRound.category} do you think you can think of?`, "Get Ready to Bet!", "Start Betting!"]
    const duringBetMsgsFirstBet = [`Good Bet! Will your opponent bet higher than ${currentRound.highBet.bet}?`]
    const duringBettingMsgsResponse =[`${currentRound.highBet.player} bet ${currentRound.highBet.bet}! Can you bet higher?`, `Or let ${currentRound.highBet.player} try to get ${currentRound.highBet.bet}`]
    const endBettingMsgsHighBet = ["The betting is over!", `Congratulations! You have the high bet of ${currentRound.highBet.bet}!`, "Get ready to start answering!", "Get set!", false]
    const endBettingMsgsOthers = ["The betting is over!", `${currentRound.highBet.player} has the high bet of ${currentRound.highBet.bet}!`, `${currentRound.highBet.player} is getting ready to start answering...`, false]
    const duringAnsweringMsgsIsAnswering = ["Go! Start entering your answers before the timer expires!"]
    const duringAnsweringMsgsOthers = [`Watch while ${currentRound.highBet.player} tries to get more than ${currentRound.highBet.bet} answers!`]
    const waitingForJudgeMsgs = ["The Timer is Over!", "We are waiting for the judge to to determine if some answers are correct..."]
    const endAnsweringWinningMsgs = [`Great Job ${currentRound.highBet.player}!`, `You got ${currentRound.highBet.bet} answers correct!`, "You win a point for the round!", false]
    const endAnsweringLosingMsgs = ["The Timer is Over!", `Sorry ${currentRound.highBet.player}, you couldn't reach ${currentRound.highBet.bet} answers`, "Your opponent gets a point for the round", false]
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
            if (localPlayerData.isHighBet) {
                setMessageArray(duringBetMsgsFirstBet)
            } else {
                setMessageArray(duringBettingMsgsResponse)
            }
        } else if (gamePhase.endBetting) {
            if (localPlayerData) {
                if (localPlayerData.isHighBet) {
                    setMessageArray(endBettingMsgsHighBet)
                } else {
                    setMessageArray(endBettingMsgsOthers)
                }
            }
        } else if (gamePhase.duringAnswering) {
            if (localPlayerData) {
                if (localPlayerData.isHighBet) {
                    setMessageArray(duringAnsweringMsgsIsAnswering)
                } else {
                    setMessageArray(duringAnsweringMsgsOthers)
                }
            }
        } else if (gamePhase.endAnswering) {
            if (wonRound === true) {
                setMessageArray(endAnsweringWinningMsgs)
            } else if (wonRound === false) {
                setMessageArray(endAnsweringLosingMsgs)
            }
        } else if (gamePhase.waitingForJudge) {
            setMessageArray(waitingForJudgeMsgs)
        } else if (gamePhase.gameEnding) {
            setMessageArray(gameEndingMsgs)
        } else {
            console.log("something went wrong setting messages")
        }
    }, [gamePhase])


    return (
        <>
            {messages}
        </>
    )
}