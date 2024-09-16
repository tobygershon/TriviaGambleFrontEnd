// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, onSnapshot, doc, collection, updateDoc, arrayUnion } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2PvV_2VQo4X6CoZ-0OacZej6xJSYPbwc",
  authDomain: "triviagamble.firebaseapp.com",
  projectId: "triviagamble",
  storageBucket: "triviagamble.appspot.com",
  messagingSenderId: "1049182867494",
  appId: "1:1049182867494:web:a331459c02d2ba4579d6e7",
  measurementId: "G-61MRHNJY22"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
export const db = getFirestore(app);

const gamesCollectionRef = collection(db, "games");


// not used
export async function getGame(id) {
    const unsub = onSnapshot(doc(db, "games", id), (doc) => {
        console.log("Current data: ", doc.data());
    })

    unsub()
}

// method to update high bet from front end for both round and player docs
export function updateHighBet(currentRoundId: string, playerId: string, playerName: string, highBet: number) {
    const currentRoundDocRef = doc(db, "rounds", currentRoundId);
    const playerDocRef = doc(db, "players", playerId)

    updateDoc(currentRoundDocRef, {
        highBet: {
            bet: highBet,
            player: playerName
        }
    })

    updateDoc(playerDocRef, {
        isHighBet: true
    })
}

// method to update answer status
export function updateAnswerStatus(answerId: string, updatedStatus: string | boolean) {
    const answerDocRef = doc(db, "answers", answerId);
    
    updateDoc(answerDocRef, {
        status: updatedStatus
    })
}

// method to update isHighBet: false after other player bets higher

export function updateNotIsHighBet(playerId: string) {
    const playerDocRef = doc(db, "players", playerId)

    updateDoc(playerDocRef, {
        isHighBet: false
    })
}

// method to send new chat to chat doc

export function sendChat(text, chatId: string) {
    const chatDocRef = doc(db, "chats", chatId)

    updateDoc(chatDocRef, {
        messages: arrayUnion(text)
    })
}