import Navbar from "./Navbar"
import Titlebar from "./Titlebar"

const Dashboard = () => {
  return (
    <div className="mx-auto 2xl:w-[1440px]">
      <Titlebar />
      <div className="flex">
        <div className="bg-clr-900 w-40">
          <Navbar />
        </div>
        <div className="flex-1" ></div>
      </div>
    </div>
  )
}

export default Dashboard