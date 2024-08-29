import { useState, useEffect, useRef } from "react";
import { motion, useAnimate, AnimatePresence } from "framer-motion";

export default function Timer() {

    const ref = useRef(5)
    const [number, setNumber] = useState(5)

    // const [scope, animate] = useAnimate()

    function countdown() {
        const clearRef = setInterval(() => {
            if (ref.current === 0) {
                setNumber(prevNum => prevNum - 1)
                clearInterval(clearRef)
            } else {
                setNumber(prevNum => prevNum - 1)
                ref.current -= 1
                console.log(ref.current)
            }
        }
            , 1000)
    }

    useEffect(() => {
        countdown()
    }, [])

    // useEffect(() => {
    //     animate("p", {scale: .75}, {duration: 1})
    // }, [number])

    return (
        // <div id="timer" ref={scope} >
        //     {number === 5 && <p>
        //         {number}
        //         </p>}
        //     {number === 4 && <p>
        //         {number}
        //     </p>}
        //     {number === 3 && <p>
        //         {number}
        //     </p>}
        //     {number === 2 && <p>
        //         {number}
        //     </p>}
        //     {number === 1 && <p>
        //         {number}
        //     </p>}
        //     {number === 0 && <p>
        //         {number}
        //     </p>}
        // </div>

        <AnimatePresence>
            <motion.div 
                id='timer'
                // initial={{scale: 1}}
                animate={{borderRadius: ['20%', '40%', '20%', '40%', '20%', '40%', '20%', '40%', '20%', '40%', '20%', '40%', '20%'],
                            scale: [1, 1.25, 1, 1.25, 1, 1.25, 1, 1.25, 1, 1.25, 1, 1.25, 1]
                }}
                transition={{duration: 6}}
                >
                {number === 5 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [.75, 1, .75] }}
                        transition={{ duration: 1 }}
                    >
                        {number}
                    </motion.div>
                )}
                {number === 4 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [.75, 1, .75] }}
                        transition={{ duration: 1 }}
                    >
                        {number}
                    </motion.div>
                )}
                {number === 3 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [.75, 1, .75] }}
                        transition={{ duration: 1 }}
                    >
                        {number}
                    </motion.div>
                )}
                {number === 2 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [.75, 1, .75] }}
                        transition={{ duration: 1 }}
                    >
                        {number}
                    </motion.div>
                )}
                {number === 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [.75, 1, .75] }}
                        transition={{ duration: 1 }}
                    >
                        {number}
                    </motion.div>
                )}
                {number === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, scale: 1}}
                        transition={{ duration: 1 }}
                    >
                        {number}
                    </motion.div>
                )}
                {number < 0 && (
                    <motion.div
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: [1, .75, 0], scale: [1, 1.5, 0] }}
                        transition={{ duration: 2 }}
                    >
                        0
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>

    )
}