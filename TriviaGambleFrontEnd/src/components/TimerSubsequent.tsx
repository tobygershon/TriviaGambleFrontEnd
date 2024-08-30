import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion'

export default function TimerFinal({ number }) {

    //This version of the timer only exists to help exit animation for 0
    return (
        <motion.div id='timer'>
                <motion.div
                    initial={{ opacity: 0, scale: .75}}
                    animate={{ opacity: [1, .5, 0], scale: [.75, 1, 0] }}
                    transition={{ duration: 2 }}
                >
                    {number}
                </motion.div>
                </motion.div>
    )
}