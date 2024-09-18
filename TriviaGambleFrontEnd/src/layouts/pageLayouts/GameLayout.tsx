import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { onSnapshot, doc } from 'firebase/firestore'
import { db } from '../../services/FirestoreService'
import Header from '../componentLayouts/HeaderLayout'
import SideMenu from '../componentLayouts/SideMenu'
import ActionGameLayout from '../componentLayouts/ActionGameLayout'
import ChatLayout from '../componentLayouts/ChatLayout'
import { useStore } from '@tanstack/react-store'
import { store } from '../../store'

export default function GameLayout() {
    // gameId from url params
    const gameId: string | undefined = useParams().gameId

    // define types for objects related to firestore docs
    type GameData = {
        "hasStarted": boolean;
        "hasEnded": boolean;
        "endingScore": number;
        "winner": string;
        "players": string[];
        "rounds": string[];
    }

    type PlayerData = {
        "name": string;
        "score": number;
        "isJudge": boolean;
        "isAnswering": boolean;
        "isHighBet": boolean;
    }

    type RoundData = {
        "category": string;
        "isBetting": boolean;
        "highBet": {
            "bet": number;
            "player": string;
        },
        "isOver": boolean;
        "answers": string[]
    }

        // below are the onSnapshot effects to update real time info

    // update game info
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "games", gameId), (snapshot) => {
            if (snapshot.data()) {
                updateGameData(snapshot.data())
            } else {
                console.log("error retrieving game data")
            }
        })
        return unsub
    }, [])

    

    // update current round info
    const [currentRoundId, setCurrentRoundId] = useState("")
    useEffect(() => {
        if (currentRoundId) {
        const unsub = onSnapshot(doc(db, "rounds", currentRoundId), (snapshot) => {
            if (snapshot.data()) {
                updateCurrentRound(snapshot.data())
            } else {
                console.log("error retrieving current round data")
            }
    })
    return unsub
}
}, [currentRoundId])

    // current state of game below
    const gameData = useStore(store, (state) => state["game"])
    const updateGameData = (gameObj) => {
        store.setState((state) => ({
            ...state,
            ["game"]: gameObj
        }))
    }

    const currentRoundData = useStore(store, (state) => state["currentRound"])
    const updateCurrentRound = (roundObj) => {
        store.setState((state) => ({
            ...state,
            ["currentRound"]: roundObj
        }))
    }


    useEffect(() => {
        setCurrentRoundId(getCurrentRoundId())
    }, [gameData])

    function getCurrentRoundId() {
        return gameData.rounds[gameData.rounds.length - 1]
    }

    // timer state and functions below, as well as function to update high Bet from keyboard

    const [toggleTimerReset, setTimerReset] = useState(false)
    const [timerIsOver, setTimerIsOver] = useState(false)

    function resetTimer() {
        setTimerReset(prev => !prev)
    }

    function disableSubmit(isOver: boolean) {
        setTimerIsOver(isOver)
        setTimeout(() => setTimerIsOver(false), 10000)
    }

    // map ActionGameLayout components for each player to render if player stored in localstorage matches player

    // get localPlayer
    const localPlayer = useStore(store, (state) => state['localPlayerId'])

    const actionLayouts = gameData.players.map((player) => (
        (localPlayer === player) && 
        <ActionGameLayout 
            key={player}
            localPlayer={player}
            resetTimer={resetTimer}
            timerOver={timerIsOver}
        />
    ))

    return (
        <div id="game-board">
            <Header gameId={gameId} resetTimer={toggleTimerReset} disableSubmit={disableSubmit} players={gameData.players} />
            <div id="columns" className="">
                <SideMenu gameData={gameData} currentRound={currentRoundData} />
                {actionLayouts}
            </div>
            <ChatLayout chatId={gameData.chat} />
        </div>
    )

}