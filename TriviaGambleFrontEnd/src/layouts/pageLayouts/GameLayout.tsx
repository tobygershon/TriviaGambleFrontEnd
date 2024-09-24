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
    const gameId: string = useParams().gameId

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

        // update local player info

    const localPlayerId = useStore(store, (state) => state["localPlayerId"])
    const updateLocalPlayerData = (playerObj) => {
        store.setState((state) => ({
            ...state,
            ["localPlayer"]: playerObj
        }))
       }

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "players", localPlayerId), (snapshot) => {
            if (snapshot.data()) {
                updateLocalPlayerData(snapshot.data())
                console.log('local player snapshot from gamelayout')
            } else {
                console.log("error retrieving localPlayer data")
            }
        })
        return unsub
    }, [])

    // update game info
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "games", gameId), (snapshot) => {
            if (snapshot.data()) {
                updateGameData(snapshot.data())
                console.log("game data from snapshot in gamelayout")
            } else {
                console.log("error retrieving game data")
            }
        })
        return unsub
    }, [])

     // current state of game below
     const gameData = useStore(store, (state) => state["game"])
     const updateGameData = (gameObj) => {
         store.setState((state) => ({
             ...state,
             ["game"]: gameObj
         }))
        }

    // update current round info

    const [currentRoundId, setCurrentRoundId] = useState("")

    useEffect(() => {
        const roundId = getCurrentRoundId()
        if (roundId) {
            setCurrentRoundId(roundId)
        }
    }, [gameData])

    function getCurrentRoundId() {
        return gameData.rounds[gameData.rounds.length - 1]
    }
    
    useEffect(() => {
        if (currentRoundId) {
        const unsub = onSnapshot(doc(db, "rounds", currentRoundId), (snapshot) => {
            if (snapshot.data()) {
                updateCurrentRound(snapshot.data())
                console.log("current round snapshot from gamelayout")
            } else {
                console.log("error retrieving current round data")
            }
        })
        return unsub
        }
    }, [currentRoundId])

    const currentRoundData = useStore(store, (state) => state["currentRound"])
    const updateCurrentRound = (roundObj) => {
        store.setState((state) => ({
            ...state,
            ["currentRound"]: roundObj
        }))
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

    const actionLayouts = gameData.players.map((player) => (
        (localPlayerId === player) && 
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