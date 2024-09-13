import { useEffect } from "react"
import { store } from "../store"

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

export const PhaseChangeHelper = (gamePhase, gameData, currentRound) => {

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

    }