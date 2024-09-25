import { backIn } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnswerButtons({ text, clicked, changeClick }) {

    const leftBtn = () => text === "Right" ? true : false
    const [btnColor, setBtnColor] = useState("")

    useEffect(() => {
        if (clicked) {
            if (text === 'Right') {
                setBtnColor("#43BCCD")
            } else if (text === "Appeal!") {
                setBtnColor("#F86624")
            } else {
                setBtnColor("#EA3546")
            }
        }
    }, [clicked])

    function handleClick() {
        changeClick(text)
    }

    return (
        <div className={leftBtn() ? "answer-btn left-answer-btn" : "answer-btn"} onClick={handleClick} style={clicked ? {background: btnColor} : {background: "#F9C80E"}}>
            {text === "Right" && <i className="fa-solid fa-check"></i>}
            {text === "Wrong" && <i className="fa-solid fa-xmark"></i>}
            {text == "Appeal!" && <div className="is-flex is-align-items-center"><span>{clicked ? "" : "Appeal"}</span><i className="fa-solid fa-question"></i></div>}
        </div>
    )
}