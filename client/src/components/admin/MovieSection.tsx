import { useState } from "react"
import PlusIcon from "../../assets/plus.svg"
import CreateMovie from "./CreateMovie"

const MovieSection = () => {
  const [isCreatingMovie, setIsCreatingMovie] = useState<boolean>(false)

  return (
    <div className="p-4 relative">
      <div className="flex items-center justify-between px-8 py-2 bg-clr-900 rounded-md mb-4">
        <h2 className="text-clr-100 font-bold">Movies</h2>
        <button onClick={() => setIsCreatingMovie(prevState => !prevState)} className="bg-clr-100 hover:bg-clr-100/80 text-clr-900 px-2 py-1 flex items-center gap-x-1 rounded-sm"><img src={PlusIcon} className="w-4 h-4" />Add</button>
      </div>
      {isCreatingMovie && <CreateMovie setIsCreatingMovie={setIsCreatingMovie} />}
    </div>
  )
}

export default MovieSection