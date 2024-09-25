import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom"
import GeneralLayout from "./layouts/pageLayouts/GeneralLayout"
import GameLayout from "./layouts/pageLayouts/GameLayout"
import HomeLayout from "./layouts/pageLayouts/HomeLayout"
import { loader as homeLoader } from "./layouts/pageLayouts/HomeLayout"

import './App.css'

function App() {

      const router = createBrowserRouter(createRoutesFromElements(

      <Route path="/" element={<GeneralLayout />} >
        <Route path="" element={<HomeLayout />} loader={homeLoader}/>
        <Route path="/:gameId" element={<GameLayout />}/>
      </Route>
     
  ))

  return (
    <RouterProvider router={router} />
  )
}

export default App
