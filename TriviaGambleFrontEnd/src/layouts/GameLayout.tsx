import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { onSnapshot, doc } from 'firebase/firestore'
import { db } from '../services/FirestoreService'
import Header from './HeaderLayout'
import SideMenu from './SideMenu'
import ActionGameLayout from './ActionGameLayout'
import ChatLayout from './ChatLayout'
import { useStore } from '@tanstack/react-store'
import { store } from '../store'

localStorage.setItem('localPlayer', 'W6QREIhHnX56BTxjaiqN')

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

    // current state of game below
    const gameData = useStore(store, (state) => state["game"])
    const updateGameData = (gameObj) => {
        store.setState((state) => ({
            ...state,
            ["game"]: gameObj
        }))
    }

    const [currentRoundId, setCurrentRoundId] = useState("")

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

    // timer state and functions below

    const [toggleTimerReset, setTimerReset] = useState(false)
    const [timerIsOver, setTimerIsOver] = useState(false)

    function resetTimer() {
        setTimerReset(prev => !prev)
    }

    function disableSubmit(isOver: boolean) {
        setTimerIsOver(isOver)
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

    // map ActionGameLayout components for each player to render if player stored in localstorage matches player

    const actionLayouts = gameData.players.map((player) => (
        (localStorage.getItem('localPlayer') === player) && 
        <ActionGameLayout 
            key={player}
            localPlayer={player}
            resetTimer={resetTimer}
            timerOver={timerIsOver} 
        />
    ))

    return (
        <>
            <Header resetTimer={toggleTimerReset} disableSubmit={disableSubmit} players={gameData.players} />
            <div id="columns" className="">
                <SideMenu gameData={gameData} currentRound={currentRoundData} />
                {actionLayouts}
            </div>
            <ChatLayout />
        </>
    )

}