import { motion } from 'framer-motion'

export default function KeyboardInput({ num }) {

    const input: number = num

    return (
        <motion.div
            id='keyboard-input'
            style={{
                background: '#F9C80E',
                width: 75,
                height: 75,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
                scale: 1,
                opacity: 1
            }}
            transition={{ duration: 5 }}
        >
            {input}
            
            </ motion.div>
            )
}