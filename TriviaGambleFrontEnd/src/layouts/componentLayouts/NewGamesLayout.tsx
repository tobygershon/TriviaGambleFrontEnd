import { useState } from "react";
import GameCard from "../../components/homePageComponents/GameCard";

export default function NewGamesLayout({ unstartedGames}) {

    const gamesArray = unstartedGames.map((game: string)=> (
        <GameCard key={game} gameId={game} />
    ))
    return (
        <div id="new-game-box">
            {gamesArray}
        </div>
    )
}