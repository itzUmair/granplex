import { useState, useRef } from "react";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage"
import { storage } from "../../firebase/firebase";
import * as Types from "../../types"
import CloseIcon from "../../assets/close.svg"
import axios from "../../api/axios";

const CreateMovie = ({ setIsCreatingMovie }:{ setIsCreatingMovie:React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [formData, setFormData] = useState<Types.MovieFormStructure>({
    _id: "",
    name: "",
    description: "",
    cast: [],
    releaseDate: new Date(),
    screenshots: [],
    poster: "",
    trailer: "",
    ticketPrice: 500,
    nowShowing: true
  });

  const [castMember, setCastMember] = useState<string>("")
  const [castMemberError, setCastMemberError] = useState<string>("");
  const [files, setFiles] = useState<Types.UploadFileStructure[]>([])
  const [poster, setPoster] = useState<Types.UploadFileStructure>()
  const [trailer, setTrailer] = useState<Types.UploadFileStructure>()
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadMessages, setUploadMessages] = useState<string[]>([])
  const [uploadComplete, setUploadComplete] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  const nameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const castRef = useRef<HTMLInputElement>(null)
  const releaseDateRef = useRef<HTMLInputElement>(null)
  const screenshotRef = useRef<HTMLInputElement>(null)
  const posterRef = useRef<HTMLInputElement>(null)
  const trailerRef = useRef<HTMLInputElement>(null)
  const ticketPriceRef = useRef<HTMLInputElement>(null)
  const nowShowingRef = useRef<HTMLInputElement>(null)

  
  const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>):void => {
    setCastMemberError("")
    setError("")
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
    } else if (e.target.name === "screenshots") {
      const droppedFiles: FileList | null | undefined = screenshotRef?.current?.files
      if (droppedFiles && droppedFiles?.length > 5) {
        setError("You can add atmost 5 screenshots")
        return
      }
      if (droppedFiles && droppedFiles?.length > 0) {
        for (let i = 0; i < droppedFiles?.length; i++) {
          if (!droppedFiles[i].name.endsWith(".jpg") && !droppedFiles[i].name.endsWith(".jpeg") && !droppedFiles[i].name.endsWith(".webp")) {
            setError("Please provide images in .jpg, .jpeg or .webp format")
            return
          }
          setFiles(prevFiles => [...prevFiles, {name: droppedFiles[i].name,size: droppedFiles[i].size}])
        }
      }
    } else if (e.target.name === "poster") {
      if (posterRef?.current?.files) {
        if (!posterRef?.current?.files[0].name.endsWith(".jpg") && !posterRef?.current?.files[0].name.endsWith(".jpeg") && !posterRef?.current?.files[0].name.endsWith(".webp")) {
          setError("Please provide images in .jpg, .jpeg or .webp format")
          return
        }
        setPoster({name: posterRef?.current?.files[0].name, size: posterRef?.current?.files[0].size})
      }
    } else if (e.target.name === "trailer") {
      if (trailerRef?.current?.files) {
        if (!trailerRef.current.files[0].name.endsWith(".mp4")) {
          setError("Please provide video in .mp4 format")
          return
        }
        setTrailer({name: trailerRef?.current?.files[0].name, size: trailerRef?.current?.files[0].size})
      }
    }
  }

  const verifyFormData = ():boolean => {
    if (files.length === 0) {
      setError("Please add atleast one screenshot")
      return false
    } if (formData.name === "") {
      setError("Please provide a valid movie name")
      nameRef.current?.focus()
      return false
    } if (formData.description.length === 0) {
      setError("Please provide a valid description")
      descriptionRef.current?.focus()
      return false
    } if (formData.releaseDate.getDate > new Date().getDate) {
      setError("Release date should be either today or before.")
      releaseDateRef.current?.focus()
      return false
    }
    return true
  }

  const addCast = (e:React.FormEvent<HTMLButtonElement>) => {
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
    if (!verifyFormData()) return
    setFormSubmitted(true)
    setIsUploading(true)

    try {
      const selectedFiles = screenshotRef?.current?.files;
      if (!selectedFiles) return;
      const uploadPromises = [];
      let trailerUrl:string = "";
      let posterUrl:string = "";
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const storageRef = ref(storage, `/${formData.name}/screenshots/${file.name}`);
        const uploadPromise = uploadBytesResumable(storageRef, file)
          .then(async (fileUpload) => {
            const downloadUrl = await getDownloadURL(fileUpload.ref);
            setUploadMessages(prevMessages => [...prevMessages, `File: ${file.name} uploaded.`]);
            return downloadUrl;
          })
          .catch((error) => {
            setUploadMessages(prevMessage => [...prevMessage, `Error uploading ${file.name}: ${error.message}`]);
            return null;
          });
        uploadPromises.push(uploadPromise);
      }
      
      const selectedVideo = trailerRef?.current?.files;
      if (selectedVideo) {
        const trailerStorageRef = ref(storage, `/${formData.name}/trailer/${selectedVideo[0].name}`);
        const trailerUploadPromise = uploadBytesResumable(trailerStorageRef, selectedVideo[0])
          .then(async (trailerUpload) => {
            trailerUrl = await getDownloadURL(trailerUpload.ref);
            setUploadMessages(prevMessages => [...prevMessages, `File: ${selectedVideo[0].name} uploaded.`]);
          })
          .catch(error => {
            setUploadMessages(prevMessage => [...prevMessage, `Error uploading ${selectedVideo[0].name}: ${error.message}`])
            return null
          })
        uploadPromises.push(trailerUploadPromise)
      }   
      const selectedPoster = posterRef?.current?.files;
      if (selectedPoster) {
        const posterStorageRef = ref(storage, `/${formData.name}/poster/${selectedPoster[0].name}`);
        const posterUploadPromise = uploadBytesResumable(posterStorageRef, selectedPoster[0])
          .then(async (trailerUpload) => {
            posterUrl = await getDownloadURL(trailerUpload.ref);
            setUploadMessages(prevMessages => [...prevMessages, `File: ${selectedPoster[0].name} uploaded.`]);
          })
          .catch(error => {
            setUploadMessages(prevMessage => [...prevMessage, `Error uploading ${selectedPoster[0].name}: ${error.message}`])
            return null
          })
        uploadPromises.push(posterUploadPromise)
      }   
      
      const urls = await Promise.all(uploadPromises);

      setUploadMessages(prevMessages => [...prevMessages, "Adding movie to database."]);
      const updatedFormData = { ...formData, screenshots: urls, trailer: trailerUrl, poster: posterUrl };
      await axios.post("/movie/add", updatedFormData);
      setUploadComplete(true)
    } catch (error) {
      setError(error as string)
      setFormSubmitted(false)
      setUploadComplete(true)
    } finally {
      setUploadComplete(true)
    }
  };
  

  return (
    <div className="absolute w-1/2 left-1/2 -translate-x-1/2 bg-clr-100/50 backdrop-blur-md p-6 shadow-lg shadow-black/50">
      {!formSubmitted && <>
      <div className="flex justify-between items-center"><p className="text-clr-900 font-bold text-lg">Add new movie</p><button onClick={() => setIsCreatingMovie(false)} disabled={formSubmitted}><img src={CloseIcon} alt="close" className="w-6 h-6" /></button></div>
      <form className="w-full flex flex-col gap-y-2">
        <div>
          <label htmlFor="name" className="text-clr-900 block mb-2 text-sm font-medium ">Name:</label>
          <input type="text" ref={nameRef} id="name" name="name" autoFocus maxLength={50} value={formData?.name} className="bg-white border border-clr-900 text-clr-900 text-sm rounded-lg focus:border-clr-900 outline-none block w-full p-2.5" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="description" className="text-clr-900 block mb-2 text-sm font-medium ">Description:</label>
          <textarea ref={descriptionRef} id="description" name="description" value={formData?.description} maxLength={500} className="bg-white border border-clr-900 text-clr-900 text-sm rounded-lg focus:border-clr-900 outline-none block w-full p-2.5" onChange={handleChange} />
        </div>
        <div>
          <div className="flex gap-1 flex-wrap">{formData.cast.map((member, index) => {return <p onClick={e => removeCast(e, member)} key={index} className="bg-clr-900 cursor-pointer text-clr-100 px-2 py-1 rounded-full flex items-center gap-1">{member.name} ({member.role})</p>})}</div>
          <label htmlFor="cast" className="text-clr-900 mb-2 text-sm font-medium flex items-center justify-between">Cast: {formData.cast.length > 0 && <p className="text-xs italic">Click on the name to remove</p>}</label>
          <div className="flex items-center gap-x-1">
            <input type="text" ref={castRef} id="cast" name="cast" value={castMember} placeholder="eg: Tom Holland (Spiderman)" className="bg-white border border-clr-900 text-clr-900 text-sm rounded-lg focus:border-clr-900 outline-none block w-full p-2.5" onChange={handleChange}/>
            <button onClick={addCast} className="bg-clr-900 text-clr-100 px-4 py-2 rounded-md" disabled={formSubmitted}>Add</button>
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
          {Object.keys(files) && 
            <div className="flex flex-col w-3/4">
              {files.map((file, index) => <p key={index} className="text-sm text-clr-900 flex justify-between text-left"><span><span className="font-bold">file:</span> {file.name}</span><span><span className="font-bold">size:</span> {Number((file.size/1000).toFixed(4)) < 1000 ? `${(file.size/1000 ).toFixed(2)} KB` : `${(file.size/1048576 ).toFixed(2)} MB`}</span></p>)}
            </div>
          }
        </div>
        <div>
          <label htmlFor="poster" className="text-clr-900 block mb-2 text-sm font-medium ">Poster:</label>
          <input type="file" accept=".jpeg, .jpg, .webp" ref={posterRef} id="poster" name="poster" className="bg-white border border-clr-900 text-clr-900 text-sm rounded-lg focus:border-clr-900 outline-none block w-full p-2.5" onChange={handleChange} />
          {poster && <p className="text-sm text-clr-900 flex justify-between text-left"><span><span className="font-bold">file:</span> {poster.name}</span><span><span className="font-bold">size:</span> {Number((poster.size/1000).toFixed(4)) < 1000 ? `${(poster.size/1000 ).toFixed(2)} KB` : `${(poster.size/1048576 ).toFixed(2)} MB`}</span></p>}
        </div>
        <div>
          <label htmlFor="trailer" className="text-clr-900 block mb-2 text-sm font-medium ">Trailer:</label>
          <input type="file" accept=".mp4" ref={trailerRef} id="trailer" name="trailer" className="bg-white border border-clr-900 text-clr-900 text-sm rounded-lg focus:border-clr-900 outline-none block w-full p-2.5" onChange={handleChange} />
          {trailer && <p className="text-sm text-clr-900 flex justify-between text-left"><span><span className="font-bold">file:</span> {trailer.name}</span><span><span className="font-bold">size:</span> {Number((trailer.size/1000).toFixed(4)) < 1000 ? `${(trailer.size/1000 ).toFixed(2)} KB` : `${(trailer.size/1048576 ).toFixed(2)} MB`}</span></p>}
        </div>
        <div>
          <label htmlFor="ticketPrice" className="text-clr-900 block mb-2 text-sm font-medium ">Ticket Price:</label>
          <input type="number" max={2000} ref={ticketPriceRef} id="ticketPrice" name="ticketPrice" value={formData?.ticketPrice} className="bg-white border border-clr-900 text-clr-900 text-sm rounded-lg focus:border-clr-900 outline-none block w-full p-2.5" onChange={handleChange} />
        </div>
        <div className="flex items-center gap-x-1">
          <label htmlFor="nowShowing" className="text-clr-900 text-sm mb-1 font-medium ">Now Showing:</label>
          <input type="checkbox" ref={nowShowingRef} id="nowShowing" name="nowShowing" checked={formData?.nowShowing} onClick={() => {
            setFormData({...formData, nowShowing: !formData.nowShowing})
          }} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" onChange={handleChange} />
        </div>
        {error && <p className="bg-red-400 text-black font-bold">{error}</p>}
        <button onClick={e => {
          handleSubmit(e)
          window.scrollTo({top:0, behavior: "smooth"})
        }} className={`bg-clr-900 text-clr-100 rounded-md py-2 ${formSubmitted && "bg-clr-900/60 cursor-wait"}`} disabled={formSubmitted}>Add</button>
      </form>
      </>}
      {formSubmitted &&
        <div className="absolute left-1/2 top-0 -translate-x-1/2 bg-clr-100 text-clr-900 shadow-lg shadow-black/50 p-8 text-center w-full">
          <h2 className="font-bold text-lg">{isUploading && "Uploading Media..."}</h2>
          {isUploading && uploadMessages.map((message, index) => <p key={index} className="text-clr-900 text-sm my-1">{message}</p>)}
          {uploadComplete && <p className="text-clr-900 text-center font-bold mt-4">Movie added to database successfully!</p>}
          {uploadComplete && <button onClick={() => {
            setFormSubmitted(false)
            setUploadComplete(false)
            setFiles([])
            setIsCreatingMovie(false)
          }} className="bg-clr-900 text-clr-100 rounded-md py-2 px-4 mt-2 ">Finish</button>}
        </div>
      }
    </div>
  )
}

export default CreateMovie