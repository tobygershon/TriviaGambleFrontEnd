import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from '../../services/FirestoreService'
import { onSnapshot, doc, DocumentData } from "firebase/firestore"
import { store } from "../../store"
import { useStore } from "@tanstack/react-store"
import AnswerButtons from "./AnswerButtons"
import { submitJudgement } from "../../services/BackEndService"

export default function Answer({ answerId, count, incrementCount }) {

    const isJudge = useStore(store, (state) => state["localPlayer"].isJudge)
    // const isAnswering = useStore(store, (state) => state["localPlayer"].isAnswering)
    const waitingForJudge = useStore(store, (state) => state["gamePhase"].waitingForJudge)
    console.log(waitingForJudge + "from top")

    const [answer, setAnswer] = useState<DocumentData | undefined>(undefined)
    const [answerStatus, setAnswerStatus] = useState("")

    // useEffect dependent on answerStatus increments answerList count by 1 when changed to true, then decrements by one when changed to false
    useEffect(() => {
        if (answerStatus === "right") {
            incrementCount(1)
        } else if (answerStatus === "other") {
            incrementCount(-1)
        }
    }, [answerStatus])

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
            if (gameId) {
                if (rightClicked) {
                    submitJudgement(gameId, answerId, false, waitingForJudge)
                    console.log(waitingForJudge)
                    // updateAnswerStatus(answerId, false)
                } else if (leftClicked) {
                    submitJudgement(gameId, answerId, true, waitingForJudge)
                    // updateAnswerStatus(answerId, true)
                } else if (appealClicked) {
                    submitJudgement(gameId, answerId, "APPEALED", waitingForJudge)
                    // updateAnswerStatus(answerId, "APPEALED")
                } else {
                    submitJudgement(gameId, answerId, "PENDING", waitingForJudge)
                    // updateAnswerStatus(answerId, "PENDING")
                }
            }
        } else {
            setSkipFirst(true)
        }
    }, [rightClicked, leftClicked, appealClicked])

    // state for number color
    // also update correct answer count using same useEffect via answerStatus

    const [color, setColor] = useState("")

    useEffect(() => {
        if (answer) {
            if (answer.status === true) {
                setColor("#43BCCD")
                setAnswerStatus("right")
            } else if (answer.status === false) {
                setColor("#EA3546")
                if (answerStatus === "right") {
                    setAnswerStatus("other")
                }
            } else if (answer.status === "PENDING") {
                setColor("#F9C80E")
                if (answerStatus === "right") {
                    setAnswerStatus("other")
                }
            } else if (answer.status === "APPEALED") {
                setColor("#F86624")
                if (answerStatus === "right") {
                    setAnswerStatus("other")
                }
            }
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
                    <span className="answer-num" style={{ background: color }}>{count}</span>
                    <div className="answer-text"><span>Answer:&nbsp;</span><p style={{ color: color }}>{answer?.answer}</p></div>
                </div>
                {answer?.status === true && <p className="answer-status"><span>Result:&nbsp;</span><span style={{ color: color }} >Correct</span></p>}
                {!answer?.status && <p className="answer-status"><span>Result:&nbsp;</span><span style={{ color: color }} >Wrong</span></p>}
                {answer?.status === 'PENDING' && <p className="answer-status"><span>Result:&nbsp;</span><span >PENDING</span></p>}
                {/* {answer.status === 'APPEALED' && <p className="answer-status"><span>Result:&nbsp;</span><span >APPEALED</span></p>} */}

            </div>
            {isJudge && <div className="answer-btn-box"><AnswerButtons clicked={leftClicked} changeClick={handleClick} text={"Right"} />
                <AnswerButtons clicked={rightClicked} changeClick={handleClick} text={"Wrong"} /></div> /* div for judge with 2 buttons */}
            {/* {isAnswering && answer.status === false && <div className="appeal-btn-box" ><AnswerButtons clicked={appealClicked} changeClick={handleClick} text={"Appeal!"} /></div> /* div to appeal for isAnswering */}
        </div>


    )
}