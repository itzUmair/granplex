import { Routes, Route } from "react-router-dom"
import { RequireAuth } from "react-auth-kit"
import Signin from "./components/common/Signin"
import Signup from "./components/common/Signup"
import Dashboard from "./components/admin/Dashboard"

function App() {
  return (
    <Routes>
      <Route path="/admin/signin" element={<Signin />} />
      <Route path="/admin/signup" element={<Signup />} />
      <Route path="/admin/dashboard" element={
        <RequireAuth loginPath="/admin/signin">
          <Dashboard />
        </RequireAuth>
      }/>
    </Routes>
  )
}

export default App
