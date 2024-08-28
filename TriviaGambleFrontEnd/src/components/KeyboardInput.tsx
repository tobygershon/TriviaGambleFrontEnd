import { useState } from "react";
import { motion } from 'framer-motion'

export default function KeyboardInput({ num }) {

    const input: number = num

    return (
        <motion.div
            id='keyboard-input'
            style={{
                background: '#F9C80E',
                width: 100,
                height: 100,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
                scale: 1,
                opacity: 1
            }}
            transition={{ duration: 1 }}
        >
            {input}
            </ motion.div>
            )
}