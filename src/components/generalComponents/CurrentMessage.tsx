import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CurrentMessage({ message, endingOpacity }) {

    const lastOpacity = endingOpacity ? 1 : 0;

    return (
        <motion.div
        id="message-div"
            initial={{ opacity: .5, scale: 0 }}
            animate={{
                scale: [0, 1, 1, 1, 1,],
                opacity: [1, 1, 1, 1, lastOpacity]
            }}
            transition={{ duration: 3 }}
        >
        {message}
        </motion.div>
    )
}