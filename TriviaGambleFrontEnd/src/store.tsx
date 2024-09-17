import { Store } from "@tanstack/react-store";
import CurrentMessage from "./components/generalComponents/CurrentMessage";

export const store = new Store({
    currentMessage: ["Waiting for players to join ..."],
    isJudge: "",
    winner: "",
    isHighBet: "",
    localPlayerId: "",
    gamePhase: {
        beforeStart: true,
        gameStarting: false,
        waitingForCategory: false,  // updated to true with end of gameStarting messages
        startBetting: false,
        duringBetting: false,
        endBetting: false,
        startAnswering: false, // needs to be updated to true after endBetting messages are run
        duringAnswering: false, // needs to be updated to true after startAnswering messages are run
        waitingForJudge: false,
        endAnswering: false,
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
        chat: ""
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
