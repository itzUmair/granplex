const DeleteConfirmation = ({ message, setDeleteConfirmed, setIsDeleting }:{ message: string, setDeleteConfirmed:React.Dispatch<React.SetStateAction<boolean>>, setIsDeleting:React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <div className="shadow-lg shadow-black/50 w-fit p-4 text-center absolute top-60 left-1/2 -translate-x-1/2 bg-clr-100 rounded-sm">
      <p className="text-red-400 font-bold">Are you sure you want to delete:</p>
      <p>{message}</p>
      <div className="mt-4">
        <button onClick={() => setIsDeleting(false)} className="bg-clr-900 text-clr-100 font-semibold px-2 py-1 mr-4 rounded-sm">Cancel</button>
        <button onClick={() => setDeleteConfirmed(true)} className="bg-red-500 text-clr-100 font-semibold px-2 py-1 rounded-sm">Delete</button>
      </div>
    </div>
  )
}

export default DeleteConfirmation