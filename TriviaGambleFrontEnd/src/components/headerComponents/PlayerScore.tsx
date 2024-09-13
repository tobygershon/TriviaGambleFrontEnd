import { useEffect, useState } from "react"
import { db } from '../../services/FirestoreService'
import { onSnapshot, doc } from "firebase/firestore"
import { store } from "../../store"
import { useStore } from "@tanstack/react-store"

export default function PlayerScore({ player }) {

const [playerData, setPlayerData] = useState({})
const [isWinner, setIsWinner] = useState(false)
const [isJudge, setIsJudge] = useState(false)
const [isHighBet, setIsHighBet] = useState(false)

useEffect(() => {
    if (player) {
        const unsub = onSnapshot(doc(db, "players", player), (snapshot) => {
            if (snapshot.data()) {
                setPlayerData(snapshot.data())
            } else {
                console.log("error retrieving player data")
            }
            })
        return unsub
        }
}, [player])

    // using and setting store for winner
    const gameData = useStore(store, (state) => state["game"])
    const winner = gameData.winner

useEffect(() => {
    if (winner === player) {
        updateStore("winner", playerData.name)
        setIsWinner(true)
    }
}, [gameData])

useEffect(() => {
    if (playerData.isJudge) {
        updateStore("isJudge", playerData.name)
        setIsJudge(true)
    } else {
        setIsJudge(false)
    }

    if (playerData.isHighBet) {
        updateStore("isHighBet", playerData.name)
        setIsHighBet(true)
    } else {
        setIsHighBet(false)
    }
}, [playerData])

const updateStore = (field, value) => {
    store.setState((state) => ({
        ...state,
        [field]: value
    }))
}

    return (
        <div className="level-item has-text-centered">
            <div className="is-flex is-flex-direction-column is-justify-content-stretch">
                <p className="heading">{playerData.name}</p>
                <p className="title">{playerData.score}</p>
                <span></span>
            </div>
        </div>
    )
}