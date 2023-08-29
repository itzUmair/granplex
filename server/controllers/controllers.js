import { user, employee, booking, movie, hall } from "../models/models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export const home = async (req, res) => {
  res.status(200).send({ message: "Granplex API. Developed by Umair" });
};

export const signup = async (req, res) => {
  const { fname, lname, phone, email, password } = req.body;

  const userWithEmail = await userModel.findOne({ email });
  const userWithPhone = await userModel.findOne({ phone });

  if (userWithEmail) {
    res
      .status(401)
      .send({ message: "an account with this email already exists" });
    return;
  }

  if (userWithPhone) {
    res
      .status(401)
      .send({ message: "an account with this email already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await userModel.create({
      fname,
      lname,
      phone,
      email,
      password: hashedPassword,
    });
    res.status(201).send({ message: "user created successfully" });
  } catch (error) {
    res.status(400).send({ message: error._message });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  const userExists = await userModel.findOne({ email });

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
