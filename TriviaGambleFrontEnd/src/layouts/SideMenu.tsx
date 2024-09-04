import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SideMenu() {

    const [showMenu, setShowMenu] = useState(false)

    return (
        <>
            <motion.div
                className='is-flex is-justify-content-right'
                style={{ width: '100%' }}
                initial={{ opacity: 0, scale: .8 }}
                animate={{
                    opacity: [0, .1, .25, .5, 1],
                    scale: 1
                }}
                transition={{ duration: 1 }}
            >
                <a onClick={() => setShowMenu(prev => !prev)} role="button" className={showMenu ? 'navbar-burger is-active' : 'navbar-burger'} aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </motion.div>
            <div>
                <motion.aside
                    id='side-bar'
                    className={showMenu ? 'menu navbar-menu is-active' : 'menu navbar-menu'}
                    initial={{ opacity: 0, scale: .7 }}
                    animate={{
                        opacity: [0, 0, 1, 1, 1],
                        scale: [.7, .7, 1, 1, 1]
                    }}
                    transition={{ duration: 2 }}
                >
                    <div className="is-flex is-flex-direction-column mx-2 my-2">
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
            </div>
        </>
    )
}