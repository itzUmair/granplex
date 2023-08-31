const Navbar = ({currentPage, setCurrentPage}:{currentPage:string, setCurrentPage: React.Dispatch<React.SetStateAction<string>>}) => {
  return (
    <div className="pl-8 h-[94vh] pt-8">
      <button onClick={() => setCurrentPage("main")} className={`w-full mb-5 py-2 font-semibold text-clr-100 ${currentPage==="main" && "bg-clr-100 text-clr-900 rounded-tl-md rounded-bl-md"}`}>Dashboard</button>
      <button onClick={() => setCurrentPage("movies")} className={`w-full mb-5 py-2 font-semibold text-clr-100 ${currentPage==="movies" && "bg-clr-100 text-clr-900 rounded-tl-md rounded-bl-md"}`}>Movies</button>
      <button onClick={() => setCurrentPage("halls")} className={`w-full mb-5 py-2 font-semibold text-clr-100 ${currentPage==="halls" && "bg-clr-100 text-clr-900 rounded-tl-md rounded-bl-md"}`}>Halls</button>
      <button onClick={() => setCurrentPage("bookings")} className={`w-full mb-5 py-2 font-semibold text-clr-100 ${currentPage==="bookings" && "bg-clr-100 text-clr-900 rounded-tl-md rounded-bl-md"}`}>Bookings</button>
    </div>
  )
}

export default Navbar