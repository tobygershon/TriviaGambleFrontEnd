import { useEffect, useState } from "react"
import { db } from '../../services/FirestoreService'
import { motion } from "framer-motion"
import { onSnapshot, doc } from "firebase/firestore"
import { store } from "../../store"
import { useStore } from "@tanstack/react-store"

export default function PlayerScore({ player, icon }) {

    const [playerData, setPlayerData] = useState({})
    const [isWinner, setIsWinner] = useState(false)
    const [isJudge, setIsJudge] = useState(false)
    const [isHighBet, setIsHighBet] = useState(false)
    const [isAnswering, setIsAnswering] = useState(false)

    const judgeIcon = <motion.i 
                        className="fa-solid fa-scale-balanced fa-lg"
                        initial={{opacity: 0, scale: 0}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 1}}>
                    </motion.i>
    const winnerIcon = <motion.i 
                        className="fa-solid fa-crown fa-lg"
                        initial={{opacity: 0, scale: 0}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 1}}>
                        </motion.i>
    const answeringIcon = <motion.i 
                        className="fa-regular fa-comment-dots fa-lg"
                        initial={{opacity: 0, scale: 0}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 1}}>
                        </motion.i>
    const highBetIcon = <motion.i 
                        className="fa-solid fa-hand-point-up fa-lg"
                        initial={{opacity: 0, scale: 0}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 1}}>
                        </motion.i>

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

    // getting currentRound from store for high bet
    const highBet = useStore(store, (state) => state["currentRound"].highBet.bet)

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

        if (playerData.isAnswering) {
            setIsAnswering(true)
        } else if (playerData.isHighBet) {
            updateStore("isHighBet", player)
            setIsHighBet(true)
        } else {
            setIsHighBet(false)
            setIsAnswering(false)
        }
    }, [playerData])

    const updateStore = (field, value) => {
        store.setState((state) => ({
            ...state,
            [field]: value
        }))
    }

    const currentIcon = () => {
        if (isJudge) {
            return { icon: judgeIcon, text: "Judge" }
        } else if (isWinner) {
            return { icon: winnerIcon, text: "Winner!" }
        } else if (isAnswering) {
            return { icon: answeringIcon, text: "Answering" }
        } else if (isHighBet) {
            return { icon: highBetIcon, text: `High Bet ${highBet}` }
        } else {
            return { icon: icon, text: null }
        }
    }

    return (
        <motion.div
            className="level-item has-text-centered"
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{
                scale: [1.5, 1],
                rotate: [0, 360],
            }}
            transition={{ duration: 1 }}
        >
            <div className="is-flex is-flex-direction-column is-justify-content-stretch">
                <p className="heading player-name">{playerData.name}</p>
                <p className="title player-score">{playerData.score}</p>
                <span className="icon-text is-flex is-justify-content-center">
                    <span className="icon">
                        {currentIcon().icon}
                    </span>
                    {currentIcon().text ? <span>{currentIcon().text}</span> : null}
                </span>
            </div>
        </motion.div>
    )
}