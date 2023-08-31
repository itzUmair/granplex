import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { useSignOut } from "react-auth-kit"
import { useNavigate } from "react-router-dom"

const Titlebar = () => {
  const [email, setEmail] = useState<string>()
  const [showProfileOptions, setShowProfileOptions] = useState<boolean>(false)

  const signout = useSignOut()
  const navigate = useNavigate()

  useEffect(() => {
    const data = Cookies?.get("_auth_state");
    if (data) {
      setEmail(JSON.parse(data).email)
    }
  },[])

  return (
    <div className="bg-clr-900 flex justify-between items-center text-clr-100 md:px-8 md:py-2">
      <h1>Granplex</h1>
      <h3 className="font-bold">Admin Dashboard</h3>
      <div className="relative">
        <button onClick={() => setShowProfileOptions(prevState => !prevState)}>{email}</button>
        {showProfileOptions && <div className="absolute top-9 right-0 w-full flex flex-col items-start gap-y-2 bg-clr-900 rounded-sm p-2">
          <button className="hover:bg-clr-100 hover:text-clr-900 focus:bg-clr-100 focus:text-clr-900 transition-colors w-full text-left px-1">Profile</button>
          <button onClick={() => {
            signout()
            navigate("/admin/signin")
            }} className="hover:bg-clr-100 hover:text-clr-900 focus:bg-clr-100 focus:text-clr-900 transition-colors w-full text-left px-1">Sign out</button>
        </div>}
      </div>
    </div>
  )
}

export default Titlebar