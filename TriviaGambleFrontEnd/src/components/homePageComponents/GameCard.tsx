import { useState, useEffect } from "react";
import { store } from "../../store";
import { db } from "../../services/FirestoreService";
import { onSnapshot, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { addNewPlayer } from "../../services/BackEndService";
import GenericButton from "../generalComponents/GenericButton"

export default function GameCard({ gameId }) {

    const navigate = useNavigate()

    const [gameData, setGameData] = useState({players: []})
    const totalGamePlayers = 3
    const playersNeeded = totalGamePlayers - gameData.players.length

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "games", gameId), (doc) => {
            if (doc.data()) {
                setGameData(doc.data())
            } else {
                console.log("error retrieving player data in action layout")
            }
        })
        return unsub
    }, [])

    const updateStore = (playerId: string) => {
        store.setState((state) => ({
            ...state,
            ["localPlayerId"]: playerId,
        })
    )}

    async function handleJoinGame() {
        const playerId = await addNewPlayer(gameId, "fred")
        updateStore(playerId)
        navigate(`/${gameId}`)
    }


    return (
        <div className="game-card" >
            <h4>{playersNeeded} Players Needed!</h4>
            <GenericButton data={handleJoinGame} text={"Join Game!"} btnType={"generic-btn"} />
        </div>
    )
}