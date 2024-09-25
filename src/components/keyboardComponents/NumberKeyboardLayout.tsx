import React from "react";
import GenericButton from '../generalComponents/GenericButton'
import { motion } from "framer-motion";

export default function NumberKeyboard({ update, firstNum, lastNum }) {

    const numbers: string[] = createNumArray(firstNum, lastNum)

    function createNumArray(firstNumber: number, secondNumber: number): string[] {
        const numArray: string[] = []
        for (let i: number = firstNumber; i < secondNumber; i++) {
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
            timerOver={false}
        // btnWidth={50} 
        // btnHeight={50} 
        />
    ))

    return (
        <>
            <div className="num-col">
                {buttons}
            </div>

        </>
    )
}