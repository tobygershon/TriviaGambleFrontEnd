import { useState } from "react";
import GameCard from "../../components/homePageComponents/GameCard";

export default function NewGamesLayout({ unstartedGames, toggleModal, playerName}) {

    const gamesArray = unstartedGames.map((game: string)=> (
        <GameCard key={game} gameId={game} toggleModal={toggleModal} playerName={playerName} />
    ))

    return (
        <div id="new-game-box">
            {gamesArray}
        </div>
    )
}