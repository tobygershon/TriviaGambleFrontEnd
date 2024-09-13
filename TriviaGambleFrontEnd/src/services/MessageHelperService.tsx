import { useEffect, useState, useRef } from "react"
import { store } from "../store"
import { useStore } from "@tanstack/react-store"
import CurrentMessage from "../components/generalComponents/CurrentMessage"
import { updatePhase } from "./PhaseChangeService"

export const MessageHelperService = (gamePhase, gameData, localPlayerData, currentRound) => {

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

          // Below method updates phase when only messages are run

    function updatePhaseFromMsgArrayEnding() {
        if (gamePhase.gameStarting) {
          updatePhase("gameStarting", "waitingForCategory")
        } else if (gamePhase.endBetting) {
          updatePhase("endBetting", "duringAnswering")
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
    const duringBettingMsgs =["Either bet higher, or let your opponent try to match their bet"]
    const endBettingMsgsHighBet = ["The betting is over!", `Congratulations! You have the high bet of ${currentRound.highBet.bet}!`, "Get ready to start answering!", "Get set!", false]
    const endBettingMsgsOthers = ["The betting is over!", `${currentRound.highBet.player} has the high bet of ${currentRound.highBet.bet}!`, `${currentRound.highBet.player} is getting ready to start answering...`, false]
    const duringAnsweringMsgsIsAnswering = ["Go! Start entering your answers before the timer expires!"]
    const duringAnsweringMsgsOthers = [`Watch while ${currentRound.highBet.player} tries to get more than ${currentRound.highBet.bet} answers!`]
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
        <>
            {messages}
        </>
    )
}