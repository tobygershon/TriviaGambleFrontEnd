import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Keyboard from "./KeyboardLayout";
import AnswerInput from "./AnswerInputLayout";

export default function ActionGameLayout( {resetTimer, timerOver} ) {

    return (
        <motion.div
        id='action-box'
        initial={{ opacity: 0, scale: 0.5 }}
            animate={{
                opacity: [0, 0, 0, 0, 1],
                scale: [.5, .5, .5, .5, 1],
            }}
            transition={{ duration: 2 }}
        >
            <AnswerInput />
            <Keyboard resetTimer={resetTimer} timerOver={timerOver}/>
        </motion.div>

    )
}