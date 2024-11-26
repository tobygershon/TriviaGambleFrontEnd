import { useState } from "react";
import { motion } from "framer-motion";

export default function SideMenu({ gameData, currentRound }) {

    const [showMenu, setShowMenu] = useState(true)

    if (showMenu) {
        return (

        <motion.aside
            id='side-bar'
            initial={{ opacity: 0, scale: .7 }}
            animate={{
                opacity: [0, 0, 1, 1, 1],
                scale: [.7, .7, 1, 1, 1]
            }}
            transition={{ duration: 2 }}
        >
            <div id="side-bar-items" className="is-flex mx-2 my-2">
                <p className="menu-label">Game Stats</p>
                <ul className="menu-list">
                    <li>Current Round: {gameData.rounds.length}</li>
                    <li>Score to Win: {gameData.endingScore}</li>
                </ul>
                <p className="menu-label">Save and Leave Game</p>
                <ul className="menu-list">
                    <li>Save Game</li>
                    <li>Switch to another Game</li>
                </ul>
                <p className="menu-label">See Rules</p>
                <i className="fa-solid fa-bars" onClick={() => setShowMenu(prev => !prev)} ></i>
            </div>
        </motion.aside>

    )
} else {
    return (
        <motion.div
        id="collapsed-bar"
            className="mobile-bar is-flex is-justify-content-space-between"
            initial={{ opacity: 0, scale: .7 }}
            animate={{
                opacity: [0, 0, 1, 1, 1],
                scale: [.7, .7, 1, 1, 1]
            }}
            transition={{ duration: 2 }}
            >
            <span>Current Round: {gameData.rounds.length}</span>
            <span>Score to Win: {gameData.endingScore}</span>
            <i onClick={() => setShowMenu(prev => !prev)} className="fa-solid fa-bars"></i>
        </motion.div>
    )
}
}