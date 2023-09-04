import { useState } from "react"

import Navbar from "./Navbar"
import Titlebar from "./Titlebar"
import MovieSection from "./MovieSection"
import HallsSection from "./HallsSection"

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState<string>("main")

  return (
    <div className="mx-auto 2xl:w-[1440px]">
      <Titlebar />
      <div className="flex">
        <div className="bg-clr-900 w-40">
          <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
        <div className="flex-1 overflow-y-auto" >
          {currentPage === "movies" && <MovieSection />}
          {currentPage === "halls" && <HallsSection />}
        </div>
      </div>
    </div>
  )
}

export default Dashboard