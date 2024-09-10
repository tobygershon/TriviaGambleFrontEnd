import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SideMenu({ gameData, currentRound }) {

    const [showMenu, setShowMenu] = useState(false)

    return (

        <motion.aside
            id='side-bar'
            className={''}
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
                    <li>Round</li>
                    <li>Current Judge</li>
                </ul>
                <p className="menu-label">Save and Leave Game</p>
                <ul className="menu-list">
                    <li>Save Game</li>
                    <li>Switch to another Game</li>
                </ul>
                <p className="menu-label">See Rules</p>
                <ul className="menu-list">
                    <li><a>Judge</a></li>
                    <li><a>Betting</a></li>
                    <li><a>Answering</a></li>
                    <li><a>Winning</a></li>
                </ul>
            </div>
        </motion.aside>

    )
}