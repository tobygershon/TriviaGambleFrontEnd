import PlayerScore from "./PlayerScore"
import { motion } from "framer-motion"

export default function Scoreboard({ players }) {

    const diceIconArray = [<motion.i 
                            className="fa-solid fa-dice-one fa-lg"
                            initial={{opacity: 0, scale: 0.5}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{duration: 1}}></motion.i>, 
                            <motion.i className="fa-solid fa-dice-two fa-lg"
                            initial={{opacity: 0, scale: 0.5}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{duration: 1}}></motion.i>, 
                            <motion.i className="fa-solid fa-dice-three fa-lg"
                            initial={{opacity: 0, scale: 0.5}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{duration: 1}}
                            ></motion.i>, 
                            <motion.i className="fa-solid fa-dice-four fa-lg"
                            initial={{opacity: 0, scale: 0.5}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{duration: 1}}
                            ></motion.i>]

    const playerList = players.map((player, index) => (
        <PlayerScore key={player} player={player} icon={diceIconArray[index]}/>
    ))

    return (
        <>
        {playerList}
        </>
    )
}