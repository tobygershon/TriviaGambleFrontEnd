import { Store } from "@tanstack/react-store";

export const store = new Store({
    gamePhase: {
        beforeStart: true,
        gameStarting: false,
        waitingForCategory: false, // needs to be updated to true after gameStarting messages are run, as well as after round ends to start next round
        startBetting: false,
        duringBetting: false,
        endBetting: false,
        startAnswering: false, // needs to be updated to true after endBetting messages are run
        duringAnswering: false, // needs to be updated to true after startAnswering messages are run
        endAnswering: false,
        waitingForJudge: false,
        gameEnding: false
    },
    localPlayer: {
        isAnswering: false,
        isHighBet: false,
        isJudge: false,
        name: "",
        score: 0,
    },
    game: {
        endingScore: null,
        hasEnded: false,
        hasStarted: false,
        players: [],
        rounds: [],
        winner: "",
    },
    currentRound: {
        answers: [],
        category: "",
        highBet: {
            bet: 0,
            player: "",
        },
        isBetting: true,
        isOver: false,
    }
})