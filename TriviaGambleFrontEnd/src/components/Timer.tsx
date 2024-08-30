import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion'

export default function Timer({ number }) {

    return (
            <motion.div
                id='timer'
                // initial={{scale: 1}}
                animate={{
                    borderRadius: ['20%', '40%', '20%', '40%', '20%', '40%', '20%', '40%', '20%', '40%', '20%', '40%', '20%'],
                    scale: [1, 1.25, 1, 1.25, 1, 1.25, 1, 1.25, 1, 1.25, 1, 1.25, 1]
                }}
                transition={{ duration: 6 }}
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [.75, 1, .75] }}
                    transition={{ duration: 1 }}
                >
                    {number}
                </motion.div>
            </motion.div>
    )
}