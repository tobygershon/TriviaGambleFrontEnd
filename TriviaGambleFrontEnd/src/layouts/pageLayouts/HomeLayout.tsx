import { useState, useEffect } from "react"
import { useLoaderData } from "react-router-dom"
import { getAllUnstartedGames } from "../../services/BackEndService"
import GameCard from "../../components/homePageComponents/GameCard"
import NewGamesLayout from "../componentLayouts/NewGamesLayout"

export async function loader() {
    return await getAllUnstartedGames()
}

export default function HomeLayout() {

    const loader = useLoaderData()

    const [unstartedGames, setUnstartedGames] = useState([])
    useEffect(() => {
        if (loader) {
            setUnstartedGames(loader)
        }
    }, [loader])

    

    return (
        <>
        <NewGamesLayout unstartedGames={unstartedGames} />
        </>
    )
}