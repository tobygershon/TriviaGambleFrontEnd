import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CurrentMessage({ message, gamePhase, gameData, currentRound, localPlayer }) {

    // type GameData = {
    //     "hasStarted": boolean;
    //     "hasEnded": boolean;
    //     "endingScore": number;
    //     "winner": string;
    //     "players": string[];
    //     "rounds": string[];
    // }

    // type PlayerData = {
    //     "name": string;
    //     "score": number;
    //     "isJudge": boolean;
    //     "isAnswering": boolean;
    //     "isHighBet": boolean;
    // }

    // type RoundData = {
    //     "category": string;
    //     "isBetting": boolean;
    //     "highBet": {
    //         "bet": number;
    //         "player": string;
    //     },
    //     "isOver": boolean;
    //     "answers": string[]
    // }



//     useEffect(() => {
//         // start of game
//         if (!gameData.hasStarted) {
//         setMessage("We are waiting for players to join")
//     } else {
//         setMessage("The game is starting!")
//         setTimeout(toggleMessage, 5000)
//     }

//     //   waiting for judge.  showMessage bool is used to trigger next step when changed to false
//         if(currentRound) {
//             if (!showMessage && (numberOfLastRound === 0 || currentRound.isOver)) { // either beginning of game or last round is over
//                 if (localPlayer.isJudge) {
//                     toggleMessage()
//                     setMessage("Choose a category")
//                     setTimeout(toggleMessage, 5000)
//                 } else {
//                     toggleMessage()
//                     setMessage("Waiting for a category")
//                     setTimeout(toggleMessage, 5000)
//                 }
//             }

//             // after category is chosen, start betting

//             if (!showMessage && !currentRound.isOver) {  // new round added
//                 if (currentRound.isBetting && currentHighBet === 0) {
//                     toggleMessage()
//                     setMessage(`The category is ${currentRound.category}!`)
//                     setTimeout(() => setMessage("Get Ready to Bet!"), 5000)
//                     setTimeout(() => setMessage("Go! Place your bets!"), 10000)
//                     setTimeout(toggleMessage, 11000)
//                 } else if (currentRound.isBetting && currentHighBet !== lastHighBet ) {  // attempt to only set new message when new high bet occurs.
//                     toggleMessage()                                                         // possible need to add currentHighBet to dependency array?
//                     setMessage(`${currentRound.highBet.player} bet ${currentRound.highBet.bet}!`) 
//                     setTimeout(toggleMessage, 1000)
//                     setLastHighBet(currentHighBet)
//                 }
            
//                 // after betting is over

//             if (!showMessage && !currentRound.isOver && !currentRound.isBetting) {
//                 toggleMessage()
//                 setTimeout(() => setMessage(`${currentRound.highBet.player} bet the highest with ${currentRound.highBet.bet}!`), 5000)
//                 if (localPlayer.isAnswering) {
//                     setTimeout(() => setMessage(`Get Ready to Start Answering!`), 10000)
//                     setTimeout(toggleMessage, 15000)
//                 } else {
//                 setTimeout(() => setMessage(`${currentRound.highBet.player} bet the highest with ${currentRound.highBet.bet}!`), 10000)
//                 setTimeout(toggleMessage, 15000)
//                 }
//             }

//             if (!showMessage && currentRound.isOver && numberOfCurrentRound !== numberOfLastRound) {
//                 toggleMessage()
//                 setMessage("Great Job!  Get Ready for the next category!")
//                 setTimeout(toggleMessage, 5000)
//                 setNumberOfLastRound(prev => prev + 1)
//             }
//         } 
//     }
// }, [gameData, showMessage])

    return (
        <motion.div
            initial={{ opacity: .5, scale: 0 }}
            animate={{
                scale: [0, 1, 1, 1, 1, 1, 1],
                opacity: [1, 1, 1, 1, 1, 1, 0]
            }}
            transition={{ duration: 3 }}
        >
        {message}
        </motion.div>
    )
}