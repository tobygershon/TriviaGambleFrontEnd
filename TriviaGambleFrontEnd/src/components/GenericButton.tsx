import { useState } from 'react'
import { motion } from 'framer-motion'

const variants = {
    open: {rotate: [-10, 5, 0]},
    closed: {rotate: 0}
}
const variantsSubmit = {
    open: {rotate: [-20, 10, 0]},
    closed: {rotate: 360}
}

export default function Button({ text, btnWidth, btnHeight, btnType, data }) {

    const buttonText: string = text
    const btn: string = btnType

    const [btnClicked, setBtnClicked] = useState(false)

    function handleClick() {
        setBtnClicked(btnClicked => !btnClicked)
        setTimeout(() => setBtnClicked(btnClicked => !btnClicked), 500)
        data(text)
    }

    return (
        <motion.button
            className={btnType}
            onClick={handleClick}
            style={{
                background: btn === 'generic-btn' ? '#43BCCD' : '#662E9B',
                // width: btnWidth,
                // height: btnHeight,
            }}
            initial={{ opacity: 1, scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={btnClicked ? "open" : "closed"}
            variants={btn === 'submit-btn' ? variantsSubmit : variants}
            transition={{duration: 1}}
        >
            {buttonText}
        </motion.button>
    )
}