import React from "react";
import GenericButton from './GenericButton'
import KeyboardInput from "./KeyboardInput";

export default function ControlKeyboard({ update, currentNum }) {

    function updateData(value) {
        update(value)
    }

    return (

        <div className='ctrl-keyboard'>
            <GenericButton
                data={updateData}
                text='Back'
                btnType={'back-btn'}
                btnWidth={100}
                btnHeight={50} />

            <div id='key-input-box'>
                <KeyboardInput num={currentNum} />
            </div>

            <GenericButton
                data={updateData}
                text='Submit'
                btnType={'submit-btn'}
                btnWidth={100}
                btnHeight={50} />
        </div>

    )
}