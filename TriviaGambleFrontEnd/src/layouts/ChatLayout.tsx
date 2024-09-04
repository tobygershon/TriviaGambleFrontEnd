import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ChatLayout() {

    return (
        <motion.div
        id='chat-box'
        initial={{ opacity: 0, scale: 0.7 }}
            animate={{
                opacity: [0, 0, 0, 1, 1],
                scale: [.7, .7, .7, 1, 1],
            }}
            transition={{ duration: 2 }}
        >

        </motion.div>

    )
}