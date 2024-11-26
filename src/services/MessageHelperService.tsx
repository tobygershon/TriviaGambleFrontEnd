import { useEffect, useState } from "react"
import { store } from "../store"
import { useStore } from "@tanstack/react-store"
// import { updatePhase } from "./PhaseChangeService"


export const MessageHelperService = (gamePhase, currentRound, gameData, localPlayerData) => {

    // messages to return

    const setMessageArray = (msgArray: (string | boolean)[]) => {
        store.setState((state) => ({
            ...state,
            ["currentMessage"]: msgArray
        }))
    }

    // for currentMessage component, an array of current messages are looped through for different scenarios

    const beforeStartMsgs = ["Waiting for players to join ..."]
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

    // need state from store for currentRound wonRound
    const wonRound = useStore(store, (state) => state["currentRound"].wonRound)

        if (gamePhase.beforeStart) {
            setMessageArray(beforeStartMsgs)
        } else if (gamePhase.gameStarting) {
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

}