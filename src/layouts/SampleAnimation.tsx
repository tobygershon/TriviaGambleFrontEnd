import { motion } from 'framer-motion'

export const Sample = () => (

        <motion.div
            style={{background: '#ff6d6d',
                    width: 100,
                    height: 100,
            }}
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{
                scale: [1, 2, 2, 1, 1],
                rotate: [0, 0, 270, 270, 0],
                borderRadius: ["20%", "20%", "50%", "50%", "20%"]
            }}
            transition={{ duration: 2.5 }}
        />
    )
