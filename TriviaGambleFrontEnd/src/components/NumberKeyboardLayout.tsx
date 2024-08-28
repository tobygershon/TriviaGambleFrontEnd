import React from "react";
import GenericButton from './GenericButton'
import { motion } from "framer-motion";

export default function NumberKeyboard({ update }) {

    const numbers: string[] = createNumArray(10)

    function createNumArray(number: number): string[] {
        const numArray: string[] = []
        for (let i: number = 0; i < number; i++) {
            numArray.push(i.toString())
        }
        return numArray
    }

    function updateData(value) {
        update(parseInt(value))
    }

    const buttons = numbers.map((num) => (
        <GenericButton 
            data={updateData}
            key={num} 
            text={num} 
            btnType={'generic-btn'} 
            btnWidth={50} 
            btnHeight={50} />
    ))

    return (
        <>
            {buttons}
        </>
            )
}