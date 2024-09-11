import { useEffect, useState } from "react"
import { db } from '../services/FirestoreService'
import { onSnapshot, doc } from "firebase/firestore"

export default function Answer({ answerId }) {

    const [answer, setAnswer] = useState("")

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
        <div className='answer'>
            Answer: {answer ? answer.answer : "No answer yet"}
            Status: {answer.status === true ? "Correct" : "Wrong"}
        </div>


    )
}