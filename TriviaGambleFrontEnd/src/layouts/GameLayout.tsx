import { useState } from 'react'
import Keyboard from './KeyboardLayout'
import Header from './HeaderLayout'
import SideMenu from './SideMenu'
import ActionGameLayout from './ActionGameLayout'
import ChatLayout from './ChatLayout'


export default function HomeLayout() {

    const [toggleTimerReset, setTimerReset] = useState(false)
    const [timerIsOver, setTimerIsOver] = useState(false)

    function resetTimer() {
        setTimerReset(prev => !prev)
    }

    function disableSubmit(isOver: boolean) {
        setTimerIsOver(isOver)
    }

    return (
        <>
            <Header resetTimer={toggleTimerReset} disableSubmit={disableSubmit}/>
            <div className="columns">
                <div className="column is-one-fifth"><SideMenu /></div>
                <div className="column"><ActionGameLayout resetTimer={resetTimer} timerOver={timerIsOver} /></div>
            </div>
            <ChatLayout />
        </>
    )

}