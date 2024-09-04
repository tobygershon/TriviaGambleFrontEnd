import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { onSnapshot, doc } from 'firebase/firestore'
import { db } from '../services/FirestoreService'
import Header from './HeaderLayout'
import SideMenu from './SideMenu'
import ActionGameLayout from './ActionGameLayout'
import ChatLayout from './ChatLayout'


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
    const [gameData, setGameData] = useState({
        "hasStarted": false,
        "hasEnded": false,
        "endingScore": 0,
        "winner": "",
        "players": [],
        "rounds": []
    })

    const [numberOfRounds, setNumberOfRounds] = useState(gameData.rounds.length)

    const [playersData, setPlayersData] = useState([])
    const [player1, setPlayer1] = useState({})
    const [player2, setPlayer2] = useState({})

    const [toggleTimerReset, setTimerReset] = useState(false)
    const [timerIsOver, setTimerIsOver] = useState(false)

    function resetTimer() {
        setTimerReset(prev => !prev)
    }

    function disableSubmit(isOver: boolean) {
        setTimerIsOver(isOver)
    }

    // below are the onSnapshot effects to update real time info

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "games", gameId), (document) => {
            if (document.data()) {
            setGameData(document.data())
            setNumberOfPlayers(document.data().players.length)
            setNumberOfRounds(document.data().rounds.length)
            } else {
                console.log("error retrieving game data")
            }
        })
        return unsub
    }, [])

    useEffect(() => {
        if (gameData.players[0]) {
            const unsub = onSnapshot(doc(db, "players", gameData.players[0]), (document) => {
                if (document.data()) {
                    console.log(document.data())
                } else {
                    console.log("error retrieving player data")
                }
                })
            return unsub
            }
        }, [gameData.players])

        useEffect(() => {
            if (gameData.players[1]) {
            const unsub = onSnapshot(doc(db, "players", gameData.players[1]), (document) => {
                if (document.data()) {
                    setPlayer2(document.data())
                } else {
                    console.log("error retrieving player data")
                }
                })
            return unsub
            }
        }, [gameData.players])

        useEffect(() => {
            if (gameData.players[2]) {
            const unsub = onSnapshot(doc(db, "players", gameData.players[2]), (document) => {
                if (document.data()) {
                    console.log(document.data())
                } else {
                    console.log("error retrieving player data")
                }
                })
            return unsub
            }
        }, [gameData.players])

    return (
        <>
            <Header resetTimer={toggleTimerReset} disableSubmit={disableSubmit} player2={player2.name}/>
            <div className="columns">
                <div className="column is-one-fifth"><SideMenu /></div>
                <div className="column"><ActionGameLayout resetTimer={resetTimer} timerOver={timerIsOver} /></div>
            </div>
            <ChatLayout />
        </>
    )

}