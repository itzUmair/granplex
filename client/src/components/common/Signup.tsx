import { useState, useRef } from "react"
import axios from "../../api/axios"
import { AxiosError } from "axios"
import * as Types from "../../types"

const Signup = () => {
  const [formData, setFormData] = useState<Types.SignupFormStructure>({
    fname: "",
    lname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  
  const fnameRef = useRef<HTMLInputElement>(null)
  const lnameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)

  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  const validateForm = () => {
    if (!formData.fname.length) {
      setError("First name is required");
      fnameRef.current?.focus()
      return false;
    } if (!formData.lname.length) {
      setError("Last name is required");
      lnameRef.current?.focus()
      return false;
    } else if (!formData.email.length) {
      setError("Email is required");
      emailRef.current?.focus()
      return false;
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      setError("Invalid email address");
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
    } else if (!/^\+?\d{1,3}[-.\s]?\d{1,14}$/.test(formData.phone)) {
      setError("Invalid phone number")
      phoneRef.current?.focus()
      return false
    } else if (!formData.confirmPassword.length) {
      setError("Please confirm your password");
      confirmPasswordRef.current?.focus()
      return false;
    } else if (formData.confirmPassword !== formData.password) {
      setError("Passwords do not match");
      confirmPasswordRef.current?.focus()
      return false;
    }
    return true;
  };

  const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>):void => {
    setError("")
    setSuccess("")
    if (e.target.name === "fname") {
      setFormData({...formData, fname: e.target.value})
    } 
    if (e.target.name === "lname") {
      setFormData({...formData, lname: e.target.value})
    } 
    if (e.target.name === "phone") {
      setFormData({...formData, phone: e.target.value})
    } 
    if (e.target.name === "email") {
      setFormData({...formData, email: e.target.value})
    } 
    if (e.target.name === "password") {
      setFormData({...formData, password: e.target.value})
    }
    if (e.target.name === "confirmPassword") {
      setFormData({...formData, confirmPassword: e.target.value})
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
      await axios.post("/admin/signup", {
        ...formData, confirmPassword:undefined
      });
      setSuccess("account created successfully.")
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
      <h1 className="text-clr-900 font-bold text-xl md:text-3xl text-center mt-8">Signup</h1>
      <form className="flex flex-col w-4/5 sm:w-96 px-4 border-dashed border-clr-800 border-2 mx-auto my-4 md:py-4 gap-y-3 rounded-md">
        <div>
          <label htmlFor="fname" className="text-clr-900 block mb-1 text-xs font-medium ">First name:</label>
          <input type="text" ref={fnameRef} id="fname" name="fname" autoFocus value={formData.fname} className="bg-white border border-clr-900 text-clr-900 text-sm rounded-lg focus:border-clr-900 outline-none block w-full p-2.5" onChange={handleChange} maxLength={20}/>
        </div>
        <div>
          <label htmlFor="lname" className="text-clr-900 block mb-1 text-xs font-medium ">Last name:</label>
          <input type="text" ref={lnameRef} id="lname" name="lname" value={formData.lname} className="bg-white border border-clr-900 text-clr-900 text-sm rounded-lg focus:border-clr-900 outline-none block w-full p-2.5" onChange={handleChange} maxLength={20}/>
        </div>
        <div>
          <label htmlFor="email" className="text-clr-900 block mb-1 text-xs font-medium ">Email:</label>
          <input type="email" ref={emailRef} id="email" name="email" value={formData.email} className="bg-white border border-clr-900 text-clr-900 text-sm rounded-lg focus:border-clr-900 outline-none block w-full p-2.5" onChange={handleChange} maxLength={30}/>
        </div>
        <div>
            <label htmlFor="phone" className="text-clr-900 block mb-2 text-sm font-medium">Phone:</label>
            <input type="number" inputMode="numeric" ref={phoneRef} id="phone" name="phone" value={formData.phone} className="bg-white border border-clr-900 text-clr-900 text-sm rounded-lg focus:border-clr-900 outline-none block w-full p-2.5" onChange={handleChange}/> 
          </div>
        <div>
          <label htmlFor="password" className="text-clr-900 block mb-1 text-xs font-medium">Password:</label>
          <input type={showPassword ? "text" : "password"} ref={passwordRef} id="password" name="password" value={formData.password} className="bg-white border border-clr-900 text-clr-900 text-sm rounded-lg focus:border-clr-900 outline-none block w-full p-2.5" onChange={handleChange}/> 
        </div>
        <div>
          <label htmlFor="confirmPassword" className="text-clr-900 block mb-1 text-xs font-medium">Confirm Password:</label>
          <input type={showPassword ? "text" : "password"} ref={confirmPasswordRef} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} className="bg-white border border-clr-900 text-clr-900 text-sm rounded-lg focus:border-clr-900 outline-none block w-full p-2.5" onChange={handleChange}/> 
          <button onClick={togglePasswordProtection} className="text-clr-900 italic text-xs underline underline-offset-2">{showPassword ? "hide" : "show"} password</button>
        </div>
        {error && <p className="bg-red-400 text-center text-clr-900">{error}</p>}
        {success && <p className="bg-green-400 text-center text-clr-900 font-bold">{success} <a href="/admin/signin" className="underline cursor-pointer">Try signing in.</a></p>}
        <button type="submit" onClick={handleSubmit} className="bg-clr-900 text-white font-bold py-2 px-4 rounded-lg" disabled={loading}>{loading ? "Creating account..." : "Signup"}</button>
        <p className="text-center text-clr-900">Already have an account? <a href="/admin/signin" className="underline cursor-pointer">Sign in</a></p>
      </form>
    </div>
  )
}

export default Signup