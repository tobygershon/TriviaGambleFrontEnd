import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db, updateAnswerStatus } from '../../services/FirestoreService'
import { onSnapshot, doc } from "firebase/firestore"
import { store } from "../../store"
import { useStore } from "@tanstack/react-store"
import AnswerButtons from "./AnswerButtons"
import { submitJudgement } from "../../services/BackEndService"

export default function Answer({ answerId, count }) {

    const isJudge = useStore(store, (state) => state["localPlayer"].isJudge)
    const isAnswering = useStore(store, (state) => state["localPlayer"].isAnswering)

    const [answer, setAnswer] = useState("")

    // state for judging buttons right or wrong

    const [rightClicked, setRightClicked] = useState(false)
    const [leftClicked, setLeftClicked] = useState(false)
    const [appealClicked, setAppealClicked] = useState(false)

    function handleClick(typeOfBtn: string) {
        if (typeOfBtn === "Right") {
            setLeftClicked(prev => !prev)
            setRightClicked(false)
        } else if (typeOfBtn === "Wrong") {
            setRightClicked(prev => !prev)
            setLeftClicked(false)
        } else if (typeOfBtn === "Appeal!") {
            setAppealClicked(prev => !prev)
        }
    }

    //need gameId for calls to backend
    const gameId = useParams().gameId

    // need to skip first effect on render.  create state to update after first render
    const [skipFirst, setSkipFirst] = useState(false)

    useEffect(() => {
        if (skipFirst) {
            if (rightClicked) {
                submitJudgement(gameId, answerId, false)
                // updateAnswerStatus(answerId, false)
            } else if (leftClicked) {
                submitJudgement(gameId, answerId, true)
                // updateAnswerStatus(answerId, true)
            } else if (appealClicked) {
                submitJudgement(gameId, answerId, "APPEALED")
                // updateAnswerStatus(answerId, "APPEALED")
            } else {
                submitJudgement(gameId, answerId, "PENDING")
                // updateAnswerStatus(answerId, "PENDING")
            }
        } else {
            setSkipFirst(true)
        }
    }, [rightClicked, leftClicked, appealClicked])

    // state for number color

    const [color, setColor] = useState("")

    useEffect(() => {
        if (answer.status === true) {
                setColor("#43BCCD")
            } else if (answer.status === false) {
                setColor("#EA3546")
            } else if (answer.status === "PENDING") {
                setColor("#F9C80E")
            } else if (answer.status === "APPEALED") {
                setColor("#F86624")
            }
    }, [answer])

    // set up onSnapshot for answer

    useEffect(() => {
        if (answerId) {
            const unsub = onSnapshot(doc(db, "answers", answerId), (snapshot) => {
                if (snapshot.data()) {
                    setAnswer(snapshot.data())
                } else {
                    console.log("error retrieving answer")
                }
            })
            return unsub
        }
    }, [answerId])

    return (
        <div className='answer' style={{}}>
            <div className="answer-span-1 is-flex">
                <div className="is-flex" style={{ width: "20rem" }}>
                    <span className="answer-num" style={{background: color}}>{count}</span>
                    <div className="answer-text"><span>Answer:&nbsp;</span><p style={{color: color}}>{answer.answer}</p></div>
                </div>
                {answer.status === true && <p className="answer-status"><span>Result:&nbsp;</span><span style={{color: color}} >Correct</span></p>}
                {!answer.status && <p className="answer-status"><span>Result:&nbsp;</span><span style={{color: color}} >Wrong</span></p>}
                {answer.status === 'PENDING' && <p className="answer-status"><span>Result:&nbsp;</span><span >PENDING</span></p>}
                {answer.status === 'APPEALED' && <p className="answer-status"><span>Result:&nbsp;</span><span >APPEALED</span></p>}

            </div>
            {isJudge && <div className="answer-btn-box"><AnswerButtons clicked={leftClicked} changeClick={handleClick} text={"Right"} />
            <AnswerButtons clicked={rightClicked} changeClick={handleClick} text={"Wrong"} /></div> /* div for judge with 2 buttons */}
            {isAnswering && answer.status === false && <div className="appeal-btn-box" ><AnswerButtons clicked={appealClicked} changeClick={handleClick} text={"Appeal!"} /></div> /* div to appeal for isAnswering */}
        </div>


    )
}