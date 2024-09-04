import React from "react";
import Button from './GenericButton'
import { motion } from "framer-motion";

export default function NumberKeyboard({ update }) {

    const firstNumbers: string[] = createNumArray(0, 5)
    const secondNumbers: string[] = createNumArray(5, 10)

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

    const firstButtons = firstNumbers.map((num) => (
        <Button
            data={updateData}
            key={num}
            text={num}
            btnType={'generic-btn'}
        // btnWidth={50} 
        // btnHeight={50} 
        />
    ))

    const secondButtons = secondNumbers.map((num) => (
        <Button
            data={updateData}
            key={num}
            text={num}
            btnType={'generic-btn'}
        // btnWidth={50} 
        // btnHeight={50} 
        />
    ))

    return (
        <>
            <div className="num-col-1">
                {firstButtons}
            </div>
            <div className="num-col-2">
                {secondButtons}
            </div>

        </>
    )
}