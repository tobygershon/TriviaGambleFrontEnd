import PlayerScore from "./PlayerScore"
import { store } from "../../store"
import { useStore } from "@tanstack/react-store"

export default function Scoreboard({ players }) {


    const playerList = players.map((player) => (
        <PlayerScore key={player} player={player} />
    ))

    return (
        <>
        {playerList}
        </>
    )
}