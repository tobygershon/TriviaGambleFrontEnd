import { useState } from 'react'
import Keyboard from './KeyboardLayout'
import Header from './HeaderLayout'
import SideMenu from './SideMenu'


export default function HomeLayout() {

    const [toggleTimerReset, setTimerReset] = useState(false)

    function resetTimer() {
        setTimerReset(prev => !prev)
    }

    return (
        <>
            <Header resetTimer={toggleTimerReset} />
            <div className="columns">
                <div className="column is-one-fifth"><SideMenu /></div>
                <div className="column"><Keyboard resetTimer={resetTimer} /></div>
            </div>
        </>
    )

}