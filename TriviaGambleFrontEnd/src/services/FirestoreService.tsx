// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, onSnapshot, doc, collection, updateDoc } from "firebase/firestore";

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

// method to update high bet from front end
export async function updateHighBet(currentRoundId: string, playerName: string, highBet: number) {
    const currentRoundDocRef = doc(db, "rounds", currentRoundId);

    await updateDoc(currentRoundDocRef, {
        highBet: {
            bet: highBet,
            player: playerName
        }
    })
}