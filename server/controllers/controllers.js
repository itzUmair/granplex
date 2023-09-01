import { user, employee, booking, movie, hall } from "../models/models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const home = async (req, res) => {
  res.status(200).send({ message: "Granplex API. Developed by Umair" });
};

export const signup = async (req, res) => {
  const { fname, lname, phone, email, password } = req.body;

  let userWithEmail, userWithPhone;

  if (req.url.endsWith("/user/signup")) {
    userWithEmail = await user.findOne({ email });
    userWithPhone = await user.findOne({ phone });
  } else {
    userWithEmail = await employee.findOne({ email });
    userWithPhone = await employee.findOne({ phone });
  }

  if (userWithEmail) {
    res
      .status(401)
      .send({ message: "an account with this email already exists" });
    return;
  }

  if (userWithPhone) {
    res
      .status(401)
      .send({ message: "an account with this phone number already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    if (req.url.endsWith("/user/signup")) {
      await user.create({
        fname,
        lname,
        phone,
        email,
        password: hashedPassword,
      });
    } else {
      await employee.create({
        fname,
        lname,
        phone,
        email,
        password: hashedPassword,
      });
    }
    res.status(201).send({ message: "account created successfully" });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: error._message });
      return;
    }
    res.status(500).send({ message: "something went wrong", error });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  let userExists;

  if (req.url.endsWith("/user/signin")) {
    userExists = await user.findOne({ email });
  } else {
    userExists = await employee.findOne({ email });
  }

  if (!userExists) {
    res.status(404).send({ message: "no account with this email exists" });
    return;
  }

  const validPassword = await bcrypt.compare(password, userExists.password);

  if (!validPassword) {
    res.status(401).send({ message: "wrong password" });
    return;
  }

  const userid = userExists._id.toString();

  const userData = {
    userid,
    fname: userExists.fname,
    lname: userExists.lname,
    email: userExists.email,
    phone: userExists.phone,
  };

  const token = jwt.sign(
    {
      userid,
    },
    process.env.JWT_SECRET
  );

  res.status(200).send({ message: "logged in successfully", token, userData });
};

export const addMovie = async (req, res) => {
  const {
    name,
    description,
    cast,
    releaseDate,
    ticketPrice,
    nowShowing,
    screenshots,
    trailer,
  } = req.body;

  try {
    await movie.create({
      name,
      description,
      cast,
      releaseDate,
      ticketPrice,
      nowShowing,
      screenshots,
      trailer,
    });
    res.status(201).send({ message: "movie added to database successfully" });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: error._message });
      return;
    }
    res.status(500).send({ message: "something went wrong", error });
  }
};

export const deleteMovie = async (req, res) => {
  const { movieIDString } = req.params;

  const movieID = mongoose.Types.ObjectId(movieIDString);

  try {
    await movie.deleteOne({ _id: movieID });
    res.status(200).send({ message: "movie deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "something went wrong", error });
  }
};

export const updateMovie = async (req, res) => {
  const {
    _id,
    name,
    description,
    cast,
    releaseDate,
    ticketPrice,
    nowShowing,
    screenshots,
    trailer,
  } = req.body;

  try {
    await movie.updateOne(
      { _id },
      {
        name,
        description,
        cast,
        releaseDate,
        ticketPrice,
        nowShowing,
        screenshots,
        trailer,
      }
    );
    res.status(200).send({ message: "movie updated successfully" });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: error._message });
      return;
    }
    res.status(500).send({ message: "something went wrong", error });
  }
};

export const getAllMovies = async (req, res) => {
  try {
    const movies = await movie.find();
    res
      .status(200)
      .send({ message: "fetched all movies successfully!", movies });
  } catch (error) {
    res.status(500).send({ message: "something went wrong", error });
  }
};
