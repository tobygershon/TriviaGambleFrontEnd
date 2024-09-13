import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../services/FirestoreService";
import GenericButton from '../../components/generalComponents/GenericButton'
import { sendChat } from "../../services/FirestoreService";

export default function ChatLayout({ chatId }) {

    const [chatInput, setChatInput] = useState("")

    const [chats, setChats] = useState([""])

     // subscribe to chat doc

     useEffect(() => {
        if (chatId) {
        const unsub = onSnapshot(doc(db, "chats", chatId), (snapshot) => {
            if (snapshot.data()) {
                setChats(snapshot.data().messages)
            } else {
                console.log("error retrieving chat data")
            }
        })
        return unsub
    }
    }, [chatId])

    // text input change fx
    function handleChange(event) {
        setChatInput(event.target.value)
    }

    // button functions

    function handleClear() {
        setChatInput("")
    }

    function handleSend() {
        if (chatId) {
        sendChat(chatInput, chatId)
        } else {
            console.log("no chatId available to send chat")
        }
        handleClear()
    }

    const chatsArray = () => {
        if (chats.length > 1) {
            return chats.slice(1).map((msg, index) => <p key={index} >{msg}</p>)
        } else {
            return chats.map((msg, index) => <p key={index} >{msg}</p>)
        }
    }

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
            <div id="chat-header" >
                <h6>Game Chat</h6>
                <input id="chat-input" className="text-input" type="text" value={chatInput} onChange={handleChange} placeholder="message"></input>
                <GenericButton text="Clear" data={handleClear} />
                <GenericButton text="Send" data={handleSend} />
            </div>
            <div id="chat-div">
                
                {chatsArray()}
            </div>
        </motion.div>

    )
}