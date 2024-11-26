import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../services/FirestoreService";
import { store } from "../../store";
import { useStore } from "@tanstack/react-store";
import GenericButton from '../../components/generalComponents/GenericButton'
import { sendChat } from "../../services/FirestoreService";

export default function ChatLayout({ chatId }) {

    // get localPlayer name from store

    const localPlayerName = useStore(store, (state) => state["localPlayer"].name)

    // state of chats

    const [chatInput, setChatInput] = useState("")

    const [chats, setChats] = useState([{}])

    const [chatCount, setChatCount] = useState(0)  // this is only necessary to add unique id to array b/c firestore does not allow duplicate entries of same values

     // subscribe to chat doc

     useEffect(() => {
        if (chatId) {
        const unsub = onSnapshot(doc(db, "chats", chatId), (snapshot) => {
            if (snapshot.data()) {
                setChats(snapshot.data()?.messages)
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
            const chatObj = {
                text: chatInput,
                player: localPlayerName,
                id: `${localPlayerName}${chatCount}`
            }
        sendChat(chatObj, chatId)
        setChatCount(prev => prev + 1)
        } else {
            console.log("no chatId available to send chat")
        }
        handleClear()
    }

    const chatsArray = () => {
        if (chats.length > 1) {
            return chats.slice(1).map((msg, index) => <div className={localPlayerName === msg.player ? "chat local" : "chat other"} key={index} > <p className="chat-text" >{msg.player === localPlayerName ? <span><i className="fa-solid fa-comment"></i>&nbsp;</span> : <span>{msg.player}&nbsp;<i className="fa-regular fa-comments"></i></span>}&nbsp;{msg.text}</p></div>)
        } else {
            return chats.map((msg, index) => <div className="chat" key={index}><p className="chat-text other" >{msg.text}</p></div>)
        }
    }

    const messages = chatsArray()

    //below ref and effect auto scrolls to new last element when messages is updated

    const chatsRef = useRef(null)

    useEffect(() => {
        chatsRef.current?.lastElementChild?.scrollIntoView({behavior: "smooth"})
    }, [messages])


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
                <input id="chat-input" className="text-input" type="text" value={chatInput} onChange={handleChange} onKeyUp={(e) => e.key == "Enter" ? handleSend() : null} placeholder="message"></input>
                <div>
                    <GenericButton text="Clear" data={handleClear} />
                    <GenericButton text="Send" data={handleSend} />
                </div>
                
            </div>
            <div id="chat-div" ref={chatsRef}>
                {messages}
            </div>
        </motion.div>

    )
}