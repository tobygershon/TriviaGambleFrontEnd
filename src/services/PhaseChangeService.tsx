import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { store } from "../store"
import { useStore } from "@tanstack/react-store"

// below the phases of game are updated in the store

export const updatePhase = (phase1: string, phase2: string) => {
    store.setState((state) => ({
        ...state,
        ["gamePhase"]: {
            ...state["gamePhase"],
            [phase1]: false,
            [phase2]: true,
        },
    })
    )}

export const PhaseChangeHelper = () => {

    // get the gameId from params
    // const gameId = useParams().gameId

    // gamephase from store
    const gamePhase = useStore(store, (state) => state["gamePhase"])

    // update gamePhase object in store when gamePhase is updated in db

    const updatedGamePhaseFromGameObj = useStore(store, (state) => state["game"].gamePhase)
    useEffect(() => {
        if (gamePhase.beforeStart) {
            updatePhase("beforeStart", updatedGamePhaseFromGameObj)
        } else if (gamePhase.gameStarting) {
            updatePhase("gameStarting", updatedGamePhaseFromGameObj)
        } else if (gamePhase.waitingForCategory) {
            updatePhase("waitingForCategory", updatedGamePhaseFromGameObj)
        } else if (gamePhase.startBetting) {
            updatePhase("startBetting", updatedGamePhaseFromGameObj)
        } else if (gamePhase.duringBetting) {
            updatePhase("duringBetting", updatedGamePhaseFromGameObj)
        } else if (gamePhase.endBetting) {
            updatePhase("endBetting", updatedGamePhaseFromGameObj)
        } else if (gamePhase.duringAnswering) {
            updatePhase("duringAnswering", updatedGamePhaseFromGameObj)
        } else if (gamePhase.waitingForJudge) {
            updatePhase("waitingForJudge", updatedGamePhaseFromGameObj)
        } else if (gamePhase.endAnswering) {
            updatePhase("endAnswering", updatedGamePhaseFromGameObj)
        } else if (gamePhase.startNextRound) {
            updatePhase("startNextRound", updatedGamePhaseFromGameObj)
        }
    }, [updatedGamePhaseFromGameObj])

     // logic to determine game phase.  effects run when gameData or currentRound change
    
    //  useEffect(() => {
    //     // phase where hasStarted changed to true
    //     // if (gamePhase.beforeStart && gameData.hasStarted) {
    //     //    updateGamePhase()
    //     // }
    //     // change to end game phase
    //     if (gamePhase.endAnswering && gameData.hasEnded) { // needs changed?  do we need waitingforJudge phase here as well?
    //         updatePhase("endAnswering", "gameEnding")
    //     }
    //     }, [gameData])

    // useEffect(() => {
    //     // starting betting after category is submitted
    //         // if (gamePhase.waitingForCategory && currentRound.isBetting) {

    //         //     updatePhase("waitingForCategory", "startBetting")
    //         // }
    //         // change to during betting after a bet is submitted
    //         // if (gamePhase.startBetting && currentRound.highBet.bet !== 0) {
    //         //     updateGamePhase(gameId, "duringBetting")
    //         // }
    //         // change to end betting phase when isBetting is updated to false
    //         // if (gamePhase.duringBetting && !currentRound.isBetting) {
    //         //     updatePhase("duringBetting", "endBetting")
    //         // }
    //         // change to endAnswering phase after round isOver
    //         // if (currentRound.isOver && gamePhase.duringAnswering) {
    //         //     updatePhase("duringAnswering", "endAnswering")
    //         // }
    //         // change to endAnswering after round over from waiting for judge
    //         // if (currentRound.isOver && gamePhase.waitingForJudge) {
    //         //     updatePhase("waitingForJudge", "endAnswering")
    //         // }
    //         // phase change from duringAnswering to waitingForJudge occurs in header layout
    //         // it changes phase when timerIsOver() is called and endRound() returns 'PENDING'

    //         //phase change from endAnswering to startNextRound is called in Messages component
            
    //         //start round over when startNextRound phase reached
    //         // if (gamePhase.startNextRound && currentRound.startNextRound) {
    //         //     updatePhase("startNextRound", "waitingForCategory")      // updates phase to waitForCategory after startNewRound is updated in the current round
    //         // }
            
    // }, [currentRound])  // add gamephase to dependency array?
                                    

    }