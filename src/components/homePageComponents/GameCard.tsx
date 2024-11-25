import { useState, useEffect } from "react";
import { store } from "../../store";
import { db } from "../../services/FirestoreService";
import { onSnapshot, doc, DocumentData } from "firebase/firestore";
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

    const [gameData, setGameData] = useState<DocumentData | undefined>(undefined)
    const totalGamePlayers = 3
    const [playersNeeded, setPlayersNeeded] = useState(totalGamePlayers - gameData?.players.length)

    useEffect(() => {
        setPlayersNeeded(totalGamePlayers - gameData?.players.length)
    }, [gameData])

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "games", gameId), (doc) => {
            if (doc.data()) {
                const data: DocumentData = doc.data() as DocumentData
                setGameData(data)
            } else {
                console.log("error retrieving player data in GameCard")
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


    return (
        <>
            <div className="game-card" >
                <h4>{playersNeeded} Players Needed!</h4>
                <GenericButton data={toggleThisModal} text={"Join Game!"} btnType={"generic-btn"} timerOver={false} />
            </div>

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
                            <input type='text' name='playerName' onChange={handleChange} value={formData.playerName} placeholder="Enter your name for the game" />
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