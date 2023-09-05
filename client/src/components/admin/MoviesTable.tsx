import { useState, useEffect } from "react"
import * as Types from "../../types"
import TickIcon from "../../assets/tick.svg"
import CrossIcon from "../../assets/cross.svg"
import axios from "../../api/axios"
import toast, { Toaster } from "react-hot-toast"
import DeleteConfirmation from "./DeleteConfirmation"
import { StorageReference, deleteObject, listAll, ref } from "firebase/storage"
import { storage } from "../../firebase/firebase"
import { AxiosError } from "axios"

const MoviesTable = ({data, setAllMovies} : {data: Types.MovieFormStructure[], setAllMovies: React.Dispatch<React.SetStateAction<Types.MovieFormStructure[] | undefined>>}) => {
  const [updatingNowShowing, setUpdatingNowShowing] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [deleteConfirmed, setDeleteConfirmed] = useState(false)
  const [movieDeleting, setMovieDeleting] = useState({name: "", id:""})


  const handleDelete = (record:Types.MovieFormStructure):void => {
    setMovieDeleting({name:record.name, id:record._id})
    setIsDeleting(true)
  }

  const deleteFolderRecursively = async (folderRef:StorageReference) => {
    const items = await listAll(folderRef);
    const deleteFilePromises = items.items.map((item) => {
      return deleteObject(item);
    });
  
    const deleteFolderPromises = items.prefixes.map(async (subfolderRef) => {
      await deleteFolderRecursively(subfolderRef);
    });
  
    await Promise.all([...deleteFilePromises, ...deleteFolderPromises]);
  };

  const deleteFolder = async (folderPath:string) => {
    const movieFolderRef = ref(storage, folderPath);
    await deleteFolderRecursively(movieFolderRef);
  }
  
  useEffect(() => {
    if (!deleteConfirmed) return
    setIsDeleting(false)
    const deleteMovie = async() => {
      const deletingToast = toast.loading("Deleting...")
      try {
        await deleteFolder(`${movieDeleting.name}/`);
        await axios.get(`/movie/delete/${movieDeleting.id}`)
        const updatedMovies = data.filter(movie => movie._id !== movieDeleting.id)
        setAllMovies([...updatedMovies])
        setIsDeleting(false)
        toast.success("Deleted successfully!", {id: deletingToast})
        setDeleteConfirmed(false)
      } catch(error) {
        setDeleteConfirmed(false)
        setIsDeleting(false)
        const err = error as AxiosError
        toast.error(err.message, {id: deletingToast})
      }
    }
    deleteMovie()
  }, [deleteConfirmed])

  const toggleNowShowing = async (record:Types.MovieFormStructure):Promise<void> => {
    setUpdatingNowShowing(true)
    const loadingToast = toast.loading("Updating...")
    try {
      await axios.post("/movie/update", {...record, nowShowing: !record.nowShowing})
      toast.success(`Updated ${record.name} successfully.`, {id: loadingToast})
      const restRecords = data.filter(movie => movie.name !== record.name)
      const updatedRecord = {...record, nowShowing: !record.nowShowing}
      setAllMovies([updatedRecord, ...restRecords ])
    } catch(error) {
      toast.error(error as string, {id: loadingToast})
    } finally {
      setUpdatingNowShowing(false)
    }
  }

  return (
    <>
    <table className="w-full border-2 border-clr-900/50">
      <thead className="bg-clr-900">
        <tr className="text-left text-clr-100">
          <th className="px-2">Name</th>
          <th className="px-2">Release Date</th>
          <th className="px-2">Screenshots</th>
          <th className="px-2">Poster</th>
          <th className="px-2">Trailer</th>
          <th className="px-2">Now showing</th>
          <th className="px-2">Ticket (Rs./ head)</th>
          <th className="px-2">{/*Actions*/}</th>
        </tr>
      </thead>
      <tbody>
        {data.map(record => <tr key={record._id}>
          <td className="px-2">{record.name}</td>
          <td className="px-2">{new Date(record.releaseDate).toLocaleDateString()}</td>
          <td className="px-2">{record.screenshots.length}</td>
          <td className="px-2">{record.poster?.length ? <img src={TickIcon} alt="Yes" className="w-6 h-6"/> : <img src={CrossIcon} alt="No" className="w-6 h-6"/>}</td>
          <td className="px-2">{record.trailer?.length ? <img src={TickIcon} alt="Yes" className="w-6 h-6"/> : <img src={CrossIcon} alt="No" className="w-6 h-6"/>}</td>
          <td className="px-2">{record.nowShowing ? <img src={TickIcon} alt="Yes" className="w-6 h-6"/> : <img src={CrossIcon} alt="No" className="w-6 h-6"/>}</td>
          <td className="px-2">{record.ticketPrice}</td>
          <td>
            <button onClick={() => {handleDelete(record)}} className="bg-clr-900 text-clr-100 font-bold px-2 py-1 mr-1">Delete</button>
            <button onClick={() => {toggleNowShowing(record)}} className="bg-clr-900 text-clr-100 font-bold px-2 py-1" disabled={updatingNowShowing}>Toggle showing</button>
          </td>
        </tr>)}
      </tbody>
    </table>
    <Toaster />
    {isDeleting && movieDeleting && <DeleteConfirmation message={movieDeleting.name} setIsDeleting={setIsDeleting} setDeleteConfirmed={setDeleteConfirmed}/>}
    </>
  )
}

export default MoviesTable