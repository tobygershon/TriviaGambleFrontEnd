import { useState, useEffect } from "react"
import { useLoaderData } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { store } from "../../store"
import { getAllUnstartedGames, createNewGame } from "../../services/BackEndService"
import NewGamesLayout from "../componentLayouts/NewGamesLayout"
import GenericButton from "../../components/generalComponents/GenericButton"

export async function loader() {
    return await getAllUnstartedGames()
}

export default function HomeLayout() {

    const loader = useLoaderData()
    const navigate = useNavigate()

    const [modalOpen, setModalOpen] = useState(false)
    const [playerName, setPlayerName] = useState("")

    const [unstartedGames, setUnstartedGames] = useState({})
    useEffect(() => {
        if (loader) {
            setUnstartedGames(loader)
        }
    }, [loader])

    const updateStore = (localPlayerId: string) => {
        store.setState((state) => ({
            ...state,
            ["localPlayerId"]: localPlayerId
        }))
    }

    const toggleModal = () => setModalOpen(prev => !prev)

    async function handleNewGame() {
        const response = await createNewGame(playerName)
        updateStore(response.player_id)
        navigate(`/${response.new_game_id}`)
    }

    // modal form changes

    function handleChange(event: React.ChangeEvent) {
        const target  = event.target as HTMLInputElement
        setPlayerName(target.value)
    }


    return (
        <>
            <div id="home-layout">
                <div id="game-columns">
                    <NewGamesLayout unstartedGames={unstartedGames} toggleModal={toggleModal} playerName={playerName} />
                    <div id="invite-game-box">
                        <h4>invite others to play!</h4>
                        <GenericButton text={"Create New Game!"} btnType={'generic-btn'} data={toggleModal} />
                    </div>
                </div>
            </div>

            <div className={modalOpen ? "modal is-active" : "modal"}>
                <div className="modal-background" onClick={toggleModal}></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Join Game</p>
                        <button className="delete" aria-label="close" onClick={toggleModal}></button>
                    </header>
                    <section className="modal-card-body">
                        <form>
                            <label>Player Name</label>
                            <input type='text' name='player-name' onChange={handleChange} value={playerName} placeholder="Enter your name for the game" />
                        </form>
                    </section>
                    <footer className="modal-card-foot">
                        <div className="buttons">
                            <button className="button is-success" onClick={handleNewGame} >Join the Game!</button>
                            <button className="button" onClick={toggleModal} >Cancel</button>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    )
}