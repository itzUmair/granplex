import Spinner from "../../assets/loader.svg"

const Loader = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <img src={Spinner} alt="Loading..." />
    </div>
  )
}

export default Loader