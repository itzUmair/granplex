import { useEffect, useState } from "react"
import axios from "../../api/axios"
import * as Types from "../../types"
import toast, {Toaster} from "react-hot-toast"
import HallsInfo from "./HallsInfo"
import UpdateSchedule from "./UpdateSchedule"
import Loader from "../common/Loader"

const HallsSection = () => {
  const [halls, setHalls] = useState<Types.HallStructure[]>()
  const [schedulingMovie, setSchedulingMovie] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (schedulingMovie) return
    setIsLoading(true);
    const getHallsData = async () => {
      try {
        const response = await axios.get("/hall/all");
        setHalls(response.data.halls)
      } catch (error) {
        const err = error as Types.ResponseError;
        if (err.response?.data?.message) {
          toast.error(err.response.data.message)
        }
      } finally {
        setIsLoading(false)
      }
    }
    getHallsData()
  }, [schedulingMovie])

  return (
    <div className="p-4 relative h-[94vh]">
      <div className="flex items-center justify-between px-8 py-2 bg-clr-900 rounded-md mb-4 h-12">
        <h2 className="text-clr-100 font-bold">Halls</h2>
      </div>
      <div className="pb-8">
        {halls && halls.map(hall => <HallsInfo key={hall.number} setSchedulingMovie={setSchedulingMovie}  data={hall} />)}
      </div>
      {schedulingMovie && <UpdateSchedule hallnumber={schedulingMovie} setSchedulingMovie={setSchedulingMovie} />}
      <Toaster />
      {isLoading && <Loader />}
    </div>
  )
}

export default HallsSection