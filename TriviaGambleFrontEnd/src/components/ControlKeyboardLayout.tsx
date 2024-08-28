import React from "react";
import GenericButton from './GenericButton'
import { motion } from "framer-motion";

export default function ControlKeyboard({ update }) {

    function updateData(value) {
        update(value)
    }

    return (
        
            <div className='ctrl-keyboard'>
                <GenericButton 
                    data={updateData} 
                    text='Back' 
                    btnType={'ctrl-btn'} 
                    btnWidth={100} 
                    btnHeight={50} />
                <GenericButton data={updateData} text='Submit' btnType={'ctrl-btn'} btnWidth={100} btnHeight={50} />
            </div>
        
    )
}