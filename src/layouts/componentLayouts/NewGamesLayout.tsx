import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GameCard from "../../components/homePageComponents/GameCard";

export default function NewGamesLayout({ unstartedGames, toggleModal, playerName }) {

    const [startIndex, setStartIndex] = useState(0)
    const [xAnimate, setXAnimate] = useState(0)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    console.log(windowWidth)

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [])

    function handleCarousel(direction: string) {
        if (direction === 'right' && unstartedGames.length > startIndex + 3) {
            setXAnimate(prev => prev - windowWidth / 5.1)
            setStartIndex(prev => prev + 1)
        } else if (direction === 'left' && startIndex > 0) {
            setXAnimate(prev => prev + windowWidth / 5.1)
            setStartIndex(prev => prev - 1)
        }
    }


    const gamesArray = unstartedGames.map((game: string) => (
        <GameCard key={game} gameId={game} toggleModal={toggleModal} playerName={playerName} />
    ))


    return (
        <div id="new-game-box">
            <div id="left-arrow" style={unstartedGames.length >= 3 ? undefined : { display: 'none' }} onClick={() => handleCarousel('left')} ><i className="fa-solid fa-angles-left"></i></div>
            <div id="game-motion-box">
                <motion.div
                    className="new-game-motion-box is-flex"
                    animate={{ x: xAnimate }}
                >
                    {gamesArray}
                </motion.div>
            </div>
            <div id="right-arrow" style={unstartedGames.length >= 3 ? undefined : { display: 'none' }} onClick={() => handleCarousel('right')} ><i className="fa-solid fa-angles-right"></i></div>
        </div>
    )
}