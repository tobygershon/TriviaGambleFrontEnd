import React from "react";
import Button from './GenericButton'
import KeyboardInput from "./KeyboardInput";

export default function ControlKeyboard({ update, currentNum, timerOver }) {

    function updateData(value) {
        update(value)
    }

    return (

        <div className='ctrl-keyboard'>
            <Button
                data={updateData}
                text='Back'
                btnType={'back-btn'}
                // btnWidth={100}
                // btnHeight={50} 
                />

            <div id='key-input-box'>
                <KeyboardInput num={currentNum} />
            </div>

            <Button
                data={updateData}
                text={currentNum === 0 ? 'You Go!' : 'Submit'}
                btnType={'submit-btn'}
                // btnWidth={100}
                // btnHeight={5}
                timerOver={timerOver} />
        </div>

    )
}