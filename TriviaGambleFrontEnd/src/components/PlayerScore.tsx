import { useEffect, useState } from "react"
import { db } from '../services/FirestoreService'
import { onSnapshot, doc } from "firebase/firestore"

export default function PlayerScore({ player }) {

const [playerData, setPlayerData] = useState({})

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

    return (
        <div className="level-item has-text-centered">
            <div>
                <p className="heading">{playerData.name}</p>
                <p className="title">{playerData.score}</p>
            </div>
        </div>
    )
}