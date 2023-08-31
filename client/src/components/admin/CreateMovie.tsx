import { useState, useRef } from "react";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage"
import { storage } from "../../firebase/firebase";
import * as Types from "../../types"
import CloseIcon from "../../assets/close.svg"
import axios from "../../api/axios";

const CreateMovie = ({ setIsCreatingMovie }:{ setIsCreatingMovie:React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [formData, setFormData] = useState<Types.MovieFormStructure>({
    name: "",
    description: "",
    cast: [],
    releaseDate: new Date(),
    screenshots: [],
    trailer: "",
    ticketPrice: 500,
    nowShowing: true
  });

  const [castMember, setCastMember] = useState<string>("")
  const [castMemberError, setCastMemberError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false)
  const [uplaodMessages, setUplaodMessages] = useState<string[]>([])
  const [uploadComplete, setUploadComplete] = useState<boolean>(false)

  const nameRef = useRef(null)
  const descriptionRef = useRef(null)
  const castRef = useRef(null)
  const releaseDateRef = useRef(null)
  const screenshotRef = useRef<HTMLInputElement>(null)
  const trailerRef = useRef(null)
  const ticketPriceRef = useRef(null)
  const nowShowingRef = useRef(null)

  const uploadScreenshots = async() => {
    
  }
  
  const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>):void => {
    setCastMemberError("")
    if (e.target.name === "name") {
      setFormData({...formData, name: e.target.value})
    } else if (e.target.name === "description") {
      setFormData({...formData, description: e.target.value})
    } else if (e.target.name === "cast") {
      setCastMember(e.target.value);
    } else if (e.target.name === "releaseDate") {
        const date = new Date(e.target.value)
      setFormData({...formData, releaseDate: date})
    } else if (e.target.name === "ticketPrice") {
      setFormData({...formData, ticketPrice: Number(e.target.value)})
    }
  }

  const addCast = (e:React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const name:string = castMember.split("(")[0]
    if (name === castMember) {
      setCastMemberError("Please follow this format: Actor name (their role)")
      return
    }
    const role:string = castMember.split("(")[1].replace(")","")
    if (role.replace(/\s/g,'') === "" || /[{}[\]()]/.test(role)) {
      setCastMemberError("Please follow this format: Actor name (their role)")
      return
    }
    const alreadyExists:boolean = formData.cast.some(member => member.name === name && member.role === role)
    if (alreadyExists) {
      setCastMemberError("Member already exists")
      return
    }
    setCastMember("")
    setFormData({...formData, cast: [...formData.cast, {name, role}]})
  }

  const removeCast = (e:React.FormEvent, removedMember: Types.castStructure):void => {
    e.preventDefault()
    const newCast = formData.cast.filter(member => { 
      if (removedMember.name.trimEnd().trimStart() !== member.name && removedMember.role.trimEnd().trimStart() !== member.role) {
        return member
      }
    })
    setFormData({...formData, cast: newCast})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true)

    try {
      const selectedFiles = screenshotRef?.current?.files;
      if (!selectedFiles) return;
      const uploadPromises = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const storageRef = ref(storage, `/${formData.name}/screenshots/${file.name}`);
        const uploadPromise = uploadBytesResumable(storageRef, file)
          .then(async (fileUpload) => {
            const downloadUrl = await getDownloadURL(fileUpload.ref);
            setUplaodMessages(prevMessages => [...prevMessages, `File: ${file.name} uploaded.`]);
            return downloadUrl;
          })
          .catch((error) => {
            setUplaodMessages(prevMessage => [...prevMessage, `Error uploading ${file.name}: ${error.message}`]);
            return null;
          });
        uploadPromises.push(uploadPromise);
      }
      const urls = await Promise.all(uploadPromises);

      const updatedFormData = { ...formData, screenshots: urls };

      await axios.post("/movie/add", updatedFormData);
      setUploadComplete(true)
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div className="absolute w-1/2 left-1/2 -translate-x-1/2 bg-clr-100/50 backdrop-blur-md p-6 shadow-lg shadow-black/50">
      <div className="flex justify-between items-center"><p className="text-clr-900 font-bold text-lg">Add new movie</p><button onClick={() => setIsCreatingMovie(false)}><img src={CloseIcon} alt="close" className="w-6 h-6" /></button></div>
      <form className="w-full flex flex-col gap-y-2">
        <div>
          <label htmlFor="name" className="text-clr-900 block mb-2 text-sm font-medium ">Name:</label>
          <input type="text" ref={nameRef} id="name" name="name" autoFocus value={formData?.name} className="bg-white border border-clr-900 text-clr-900 text-sm rounded-lg focus:border-clr-900 outline-none block w-full p-2.5" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="description" className="text-clr-900 block mb-2 text-sm font-medium ">Description:</label>
          <textarea ref={descriptionRef} id="description" name="description" value={formData?.description} className="bg-white border border-clr-900 text-clr-900 text-sm rounded-lg focus:border-clr-900 outline-none block w-full p-2.5" onChange={handleChange} />
        </div>
        <div>
          <div className="flex gap-1 flex-wrap">{formData.cast.map((member, index) => {return <p onClick={e => removeCast(e, member)} key={index} className="bg-clr-900 cursor-pointer text-clr-100 px-2 py-1 rounded-full flex items-center gap-1">{member.name} ({member.role})</p>})}</div>
          <label htmlFor="cast" className="text-clr-900 mb-2 text-sm font-medium flex items-center justify-between">Cast: {formData.cast.length > 0 && <p className="text-xs italic">Click on the name to remove</p>}</label>
          <div className="flex items-center gap-x-1">
            <input type="text" ref={castRef} id="cast" name="cast" value={castMember} placeholder="eg: Tom Holland (Spiderman)" className="bg-white border border-clr-900 text-clr-900 text-sm rounded-lg focus:border-clr-900 outline-none block w-full p-2.5" onChange={handleChange}/>
            <button onClick={addCast} className="bg-clr-900 text-clr-100 px-4 py-2 rounded-md">Add</button>
          </div>
          {castMemberError && <p className="bg-red-400 pl-2 mt-1">{castMemberError}</p>}
        </div>
        <div>
          <label htmlFor="releaseDate" className="text-clr-900 block mb-2 text-sm font-medium ">Release Date:</label>
          <input type="date" ref={releaseDateRef} id="releaseDate" name="releaseDate" className="bg-white border border-clr-900 text-clr-900 text-sm rounded-lg focus:border-clr-900 outline-none block w-full p-2.5" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="screenshots" className="text-clr-900 block mb-2 text-sm font-medium ">Screenshots:</label>
          <input type="file" multiple accept=".jpg, .jpeg, .webp" ref={screenshotRef} id="screenshots" name="screenshots" className="bg-white border border-clr-900 text-clr-900 text-sm rounded-lg focus:border-clr-900 outline-none block w-full p-2.5" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="trailer" className="text-clr-900 block mb-2 text-sm font-medium ">Trailer:</label>
          <input type="file" accept=".mp4" ref={trailerRef} id="trailer" name="trailer" className="bg-white border border-clr-900 text-clr-900 text-sm rounded-lg focus:border-clr-900 outline-none block w-full p-2.5" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="ticketPrice" className="text-clr-900 block mb-2 text-sm font-medium ">Ticket Price:</label>
          <input type="number" max={2000} ref={ticketPriceRef} id="ticketPrice" name="ticketPrice" value={formData?.ticketPrice} className="bg-white border border-clr-900 text-clr-900 text-sm rounded-lg focus:border-clr-900 outline-none block w-full p-2.5" onChange={handleChange} />
        </div>
        <div className="flex items-center gap-x-1">
          <label htmlFor="nowShowing" className="text-clr-900 mb-2 text-sm font-medium ">Now Showing:</label>
          <input type="checkbox" ref={nowShowingRef} id="nowShowing" name="nowShowing" checked={formData?.nowShowing} onClick={() => {
            setFormData({...formData, nowShowing: !formData.nowShowing})
          }} className="bg-white border border-clr-900 text-clr-900 text-sm rounded-lg focus:border-clr-900 outline-none p-2.5" onChange={handleChange} />
        </div>
        <button onClick={handleSubmit}>Add</button>
      </form>
    </div>
  )
}

export default CreateMovie