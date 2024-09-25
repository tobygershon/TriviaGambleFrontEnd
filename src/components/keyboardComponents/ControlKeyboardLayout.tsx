import { useEffect, useState } from "react";
import { store } from "../../store";
import { useStore } from "@tanstack/react-store";
import GenericButton from '../generalComponents/GenericButton'
import KeyboardInput from "./KeyboardInput";

export default function ControlKeyboard({ update, currentNum, timerOver, highBet }) {

    // get local player and isHigh bet Id's from store to compare as well as gamePhase
    const localPlayerId = useStore(store, (state) => state["localPlayerId"])
    const isHighBetId = useStore(store, (state) => state["isHighBet"])
    const gamePhase = useStore(store, (state) => state["gamePhase"])

    const [changeSubmitText, setChangeSubmitText] = useState(false)

    useEffect(() => {
        if (gamePhase.duringBetting && localPlayerId !== isHighBetId) {
            setChangeSubmitText(true)
        } else {
            setChangeSubmitText(false)
        }
    }, [localPlayerId, isHighBetId, gamePhase])



    function updateData(value) {
        update(value)
    }

    return (

        <div className='ctrl-keyboard'>
            <GenericButton
                data={updateData}
                text='Back'
                btnType={'back-btn'}
                timerOver={false}
                // btnWidth={100}
                // btnHeight={50} 
                />

            <div id='key-input-box'>
                <KeyboardInput num={currentNum} />
            </div>

            <GenericButton
                data={updateData}
                text={currentNum === 0 && changeSubmitText ? `You try ${highBet}!` : 'Submit'}
                btnType={'submit-btn'}
                // btnWidth={100}
                // btnHeight={5}
                timerOver={timerOver} />
        </div>

    )
}