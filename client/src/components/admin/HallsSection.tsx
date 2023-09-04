import { useEffect, useState } from "react"
import axios from "../../api/axios"
import * as Types from "../../types"
import toast, {Toaster} from "react-hot-toast"
import HallsInfo from "./HallsInfo"

const HallsSection = () => {
  const [halls, setHalls] = useState<Types.HallStructure[]>()


  useEffect(() => {
    const getHallsData = async () => {
      try {
        const response = await axios.get("/hall/all");
        setHalls(response.data.halls)
      } catch (error) {
        const err = error as Types.ResponseError;
        if (err.response?.data?.message) {
          toast.error(err.response.data.message)
        }
        console.log(error)
      }
    }
    getHallsData()
  }, [])

  return (
    <div className="p-4 relative h-[94vh]">
      <div className="flex items-center justify-between px-8 py-2 bg-clr-900 rounded-md mb-4 h-12">
        <h2 className="text-clr-100 font-bold">Halls</h2>
      </div>
      <div className="pb-8">
        {halls && halls.map(hall => <HallsInfo  data={hall} />)}
      </div>
      <Toaster />
    </div>
  )
}

export default HallsSection