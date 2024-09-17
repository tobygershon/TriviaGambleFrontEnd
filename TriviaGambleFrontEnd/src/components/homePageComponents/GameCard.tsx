import { useState, useEffect } from "react";
import { store } from "../../store";
import { db } from "../../services/FirestoreService";
import { onSnapshot, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { addNewPlayer } from "../../services/BackEndService";
import GenericButton from "../generalComponents/GenericButton"

export default function GameCard({ gameId, toggleModal, playerName }) {

    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        playerName: ""
    })
    const clearFormData = () => setFormData({
        playerName: ""
    })

    const [gameData, setGameData] = useState({ players: [] })
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
        )
    }

    async function handleJoinGame() {
        const playerId = await addNewPlayer(gameId, formData.playerName)
        updateStore(playerId)
        navigate(`/${gameId}`)
        console.log('join game')
    }

    const toggleThisModal = () => {
        setModalOpen(prev => !prev)
        clearFormData()
    }

    function handleChange(e) {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    console.log(formData.playerName)

    return (
        <>
            <div className="game-card" >
                <h4>{playersNeeded} Players Needed!</h4>
                <GenericButton data={toggleThisModal} text={"Join Game!"} btnType={"generic-btn"} />
            </div>
d
            <div className={modalOpen ? "modal is-active" : "modal"}>
                <div className="modal-background" onClick={toggleThisModal}></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Ask others to join Game</p>
                        <button className="delete" aria-label="close" onClick={toggleThisModal}></button>
                    </header>
                    <section className="modal-card-body">
                        <form>
                            <label>Player Name</label>
                            <input type='text' name='playerName' onChange={handleChange} value={formData.playerName} placeholder="Enter your name for the game"/>
                        </form>
                    </section>
                    <footer className="modal-card-foot">
                        <div className="buttons">
                            <button className="button is-success" onClick={handleJoinGame} >Join the Game!</button>
                            <button className="button" onClick={toggleThisModal} >Cancel</button>
                        </div>
                    </footer>
                </div>
            </div>
        </>

    )
}