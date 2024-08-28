import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom"
import HomeLayout from "./layouts/HomeLayout"

import './App.css'

function App() {

      const router = createBrowserRouter(createRoutesFromElements(

      <Route path="/" element={<HomeLayout />} >

      </Route>
     
  ))

  return (
    <RouterProvider router={router} />
  )
}

export default App
