import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import TimerLayout from './TimerLayout'


export default function Header({ resetTimer }) {

    const [showTimer, setShowTimer] = useState(true)

    function timerOver(isOver: boolean) {
        if (isOver) {
            setTimeout(() => setShowTimer(false), 3000)
        }
    }

    return (
            
        <motion.nav 
            id='header'
            className="level is-mobile"
            initial={{ opacity: 0, scale: .8 }}
            animate={{
                opacity: [0, .1, .25, .5, 1],
                scale: 1
            }}
            transition={{ duration: 1 }}
            >
                
                <div className="level-item has-text-centered is-flex is-justify-content-left">
                    <div id='logo-box'>
                        { showTimer ? <TimerLayout handleTimerOver={timerOver}resetTimer={resetTimer} /> 
                        : <motion.img 
                            id='logo-img' 
                            src='/T.png' 
                            alt="logo" 
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 2}}/> }
                    </div>
                </div>
            
                <div className="level-item has-text-centered">
                    <div>
                        <p className="heading">Player</p>
                        <p className="title">Name</p>
                    </div>
                </div>
                <div className="level-item has-text-centered">
                    <div>
                        <p className="heading">Player</p>
                        <p className="title">Name</p>
                    </div>
                </div>
                <div className="level-item has-text-centered">
                    <div>
                        <p className="heading">Player</p>
                        <p className="title">Name</p>
                    </div>
                </div>
            
        </motion.nav>
    )
}