import * as Types from "../../types"

const HallsInfo = ({ data } : { data : Types.HallStructure  }) => {
  return (
    <div className="border-2 border-clr-900 rounded-md shadow-md shadow-gray-600/70 mb-8">
      <div className="w-full bg-clr-900 text-clr-100 font-bold px-2 py-1 rounded-tl-sm rounded-tr-sm">
        <h2>Hall number: {data.number}</h2>
      </div>
      <div className="px-2 py-1">
        <div className="flex justify-evenly w-full my-4">
          <span className="text-center font-bold w-full"><p>Total Seats:</p><p className="text-2xl">{data.seats}</p></span>
          <span className="text-center font-bold w-full border-l-2 border-r-2 border-clr-900"><p>Seats Booked:</p><p className="text-2xl">{data.booked.length}</p></span>
          <span className="text-center font-bold w-full"><p>Seats Available:</p><p className="text-2xl">{data.seats - data.booked.length}</p></span>
        </div>
        {data.schedule.length > 0 && 
          <div className="flex flex-col gap-y-4">
            <span className="self-center text-center">
              {new Date(data.schedule[0].showTime) <= new Date() && 
              <>
                <h3 className="font-bold">Now Showing:</h3>
                <span>
                  <p className="text-xl">{data.schedule[0].movie.name}</p>
                  <p> Started at: {new Date(data.schedule[0].showTime).toLocaleString()}</p>
                </span>
              </>
              }
            </span>
            {new Date(data.schedule[0].showTime) >= new Date() && <h3 className="text-center font-bold">Scheduled:</h3>}
            {data.schedule.map(schedule => 
              {
                if (new Date(data.schedule[0].showTime) >= new Date()){ 
                  return (
                  <span key={schedule.movie._id} className="flex items-center justify-center gap-x-8 even:bg-clr-900/10 py-2 px-1">
                    <p className="font-bold">{schedule.movie.name}</p>
                    <p>Rs. {schedule.movie.ticketPrice}<small>/head</small></p>
                    <p>{new Date(schedule.showTime).toLocaleString()}</p>
                  </span>
                  )
                }
              }
            )}
          </div>
        }
      </div>
    </div>
  )
}

export default HallsInfo