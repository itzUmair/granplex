export type SignupFormStructure = {
  fname: string,
  lname: string,
  phone: string,
  email: string,
  password: string,
  confirmPassword: string,
}

export type SigninFormStructure = {
  email: string,
  password: string
}

export type castStructure = {
  name: string,
  role: string
}

export type MovieFormStructure = {
  _id: string,
  name: string,
  description: string,
  cast: castStructure[],
  releaseDate: Date,
  screenshots: string[],
  poster: string,
  trailer: string | null,
  ticketPrice: number,
  nowShowing: boolean
}

export type UploadFileStructure = {
  name: string,
  size: number
}

export type BytesTrackerStructure = {
  file: number,
  status: "uploading" | "uploaded"
}