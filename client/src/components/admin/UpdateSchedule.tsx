import { useEffect, useState } from "react";
import axios from "../../api/axios";
import CloseIcon from "../../assets/close.svg"
import * as Types from "../../types"
import toast from "react-hot-toast"

const UpdateSchedule = ({ hallnumber, setSchedulingMovie } : { hallnumber : number, setSchedulingMovie: React.Dispatch<React.SetStateAction<number | null>> }) => {
  const [allMovies, setAllMovies] = useState<Types.MovieFormStructure[]>([])
  const [movieSelected, setMovieSelected] = useState<Types.MovieFormStructure | null>(null)
  const [datetime, setDatetime] = useState<Date>()

  useEffect(() => {
    const getAllMovie = async() => {
      const response = await axios.get("/movie/all");
      setAllMovies(response.data.movies)
    }
    getAllMovie()
  }, [])

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
    setDatetime(new Date(e.target.value))
  }

  const handleSave = async():Promise<void> => {
    if (!movieSelected) return
    const loadingToast = toast.loading("Adding movie to schedule...")
    try {
      await axios.post("/hall/schedule/add", {
        movieIDString: movieSelected._id,
        datetime,
        hallnumber
      })
      toast.success(`${movieSelected.name} scheduled at Cinema Hall: ${hallnumber}.`, {id: loadingToast})
      setSchedulingMovie(null)
    } catch (error) {
      const err = error as Types.ResponseError;
      if (err.response && err.response.data) {
        toast.error(err.response.data.message || "An error occured", {id: loadingToast})
      } else {
        toast.error("An error occured", {id: loadingToast})
      }
    }
  }

  return (
    <div className="absolute w-1/2 left-1/2 -translate-x-1/2 top-16 bg-clr-100/70 backdrop-blur-md p-4 rounded-md shadow-lg shadow-black/50">
      <div className="flex justify-between">
      <h2 className="font-bold text-xl text-clr-900">Updating Schedule of Hall {hallnumber}</h2>
        <button><img src={CloseIcon} alt="close" className="w-6 h-6" onClick={() => setSchedulingMovie(null)} /></button>
      </div>
      <h3 className="font-bold text-clr-900 text-lg">All Movies</h3>
      <small>{movieSelected ? "Movie selected" : "Select a movie"}:</small>
      <div className="flex flex-wrap overflow-y-scroll gap-2">
        {allMovies.length > 0 && !movieSelected && allMovies.map(movie => 
          <div key={movie._id} onClick={() => setMovieSelected(movie)} className=" w-28 p-2 rounded-md shadow-md shadow-black/50 flex flex-col items-center border-2 border-black cursor-pointer">
            <img src={movie.poster} alt="poster" className="w-24 aspect-[9/14] object-cover"/>
            <p className="max-w-[12ch] text-center">{movie.name}</p>
          </div>
        )}
      </div>
      <div>
        {movieSelected && 
        <>
          <div key={movieSelected._id} onClick={() => setMovieSelected(null)} className=" w-28 p-2 rounded-md shadow-md shadow-black/50 flex flex-col items-center border-2 border-black cursor-pointer">
            <img src={movieSelected.poster} alt="poster" className="w-24 aspect-[9/14] object-cover"/>
            <p className="max-w-[12ch] text-center">{movieSelected.name}</p>
          </div>
          <small className="italic text-clr-900 text-sm font-bold">Click on the movie to remove</small>
        </>}
      </div>
      <div className="flex flex-col mt-4">
        <label htmlFor="datetime" className="font-bold text-clr-900">Select Date and Time:</label>
        <input type="datetime-local" name="datetime" id="datetime" className="w-fit" onChange={handleChange} />
      </div>
      <div className="w-full flex justify-end gap-2">
        <button className="bg-clr-900 text-clr-100 font-bold rounded-md px-2 py-1 mt-4" onClick={() => setSchedulingMovie(null)}>Cancel</button>
        <button className="bg-clr-900 text-clr-100 font-bold rounded-md px-2 py-1 mt-4 disabled:bg-clr-900/50" onClick={handleSave} disabled={!movieSelected || !datetime}>Save</button>
      </div>
    </div>
  )
}

export default UpdateSchedule