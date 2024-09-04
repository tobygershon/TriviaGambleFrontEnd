import PlayerScore from "./PlayerScore"

export default function Scoreboard({ players }) {

    const playerList = players.map((player) => (
        <PlayerScore key={player} player={player}/>
    ))

    return (
        <>
        {playerList}
        </>
    )
}