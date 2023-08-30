import { useState, useRef } from "react";
import { useSignIn } from "react-auth-kit"
import axios from "../../api/axios";
import { AxiosError } from "axios"
import * as Types from "../../types"
import { useNavigate } from "react-router-dom"

const Signin = () => {
    const [formData, setFormData] = useState<Types.SigninFormStructure>({
      email: "",
      password: "",
    })
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [loading, setLoading] = useState(false)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const signin = useSignIn()
  
    const [error, setError] = useState<string>("")
  
    const validateForm = ():boolean => {
      if (!formData.email.length) {
        setError("Email is required");
        emailRef.current?.focus()
        return false;
      } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
        setError("Email must contain @ symbol followed by the domain of your email service");
        emailRef.current?.focus()
        return false;
      } else if (!formData.password.length) {
        setError("Password is required");
        passwordRef.current?.focus()
        return false;
      } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          formData.password
        )
      ) {
        setError(
          "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
        );
        passwordRef.current?.focus()
        return false;
      }
      return true;
    }
  
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
      setError("")
      if (e.target.name === "email") {
        setFormData({...formData, email: e.target.value})
      } else {
        setFormData({...formData, password: e.target.value})
      }
    }
  
    const handleSubmit = async (e:React.FormEvent<HTMLButtonElement>):Promise<void> => {
      e.preventDefault();
      setLoading(true)
      if (!validateForm()) {
        setLoading(false)
        return
      }
      try {
        const response = await axios.post("/admin/signin", formData);
        signin({
          token: response.data.token,
          expiresIn: 1440,
          tokenType: "Bearer",
          authState: {...response.data.userData}
        })
        navigate("/")
      } catch(error) {
        const err= error as AxiosError<ErrorResponse>
        setError(err?.response?.data?.message || "")
      } finally {
        setLoading(false)
      }
    }
  
    const togglePasswordProtection = (e:React.FormEvent<HTMLButtonElement>):void => {
      e.preventDefault()
      setShowPassword(prevState => !prevState)
    }
  
  
    return (
      <div>
        <h1 className="text-clr-900 font-bold text-xl md:text-3xl text-center mt-8">Login</h1>
        <form className="flex flex-col w-4/5 sm:w-96 px-4 border-dashed border-clr-800 border-2 mx-auto mt-8 p-4 md:py-8 gap-y-4 rounded-md">
          <div>
            <label htmlFor="email" className="text-clr-900 block mb-2 text-sm font-medium ">Email:</label>
            <input type="email" ref={emailRef} id="email" name="email" autoFocus value={formData.email} className="bg-white border border-clr-900 text-clr-900 text-sm rounded-lg focus:border-clr-900 outline-none block w-full p-2.5" onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="password" className="text-clr-900 block mb-2 text-sm font-medium">Password:</label>
            <input type={showPassword ? "text" : "password"} ref={passwordRef} id="password" name="password" value={formData.password} className="bg-white border border-clr-900 text-clr-900 text-sm rounded-lg focus:border-clr-900 outline-none block w-full p-2.5" onChange={handleChange}/> 
            <button onClick={togglePasswordProtection} className="text-clr-900 italic text-xs underline underline-offset-2">{showPassword ? "hide" : "show"} password</button>
          </div>
          {error && <p className="bg-clr-300 text-center text-clr-900">{error}</p>}
          <button type="submit" onClick={handleSubmit} className="bg-clr-900 hover:outline text-white font-bold py-2 px-4 rounded-lg" disabled={loading}>{loading ? "logging in..." : "Login"}</button>
          <p className="text-center text-clr-900">Don&apos;t have an account? <a href="/admin/signup" className="underline cursor-pointer">Sign up</a></p>
        </form>
      </div>
    )
}

export default Signin