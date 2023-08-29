import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    fname: {
      type: mongoose.Schema.Types.String,
      minLength: 2,
      maxLength: 20,
      required: true,
    },
    lname: {
      type: mongoose.Schema.Types.String,
      minLength: 2,
      maxLength: 20,
      required: true,
    },
    email: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    password: {
      type: mongoose.Schema.Types.String,
      minLength: 8,
      required: true,
    },
    phone: {
      type: mongoose.Schema.Types.String,
      maxLength: 30,
      required: true,
    },
  },
  { collection: "employees" }
);

const employee = mongoose.model("employeeSchema", employeeSchema);

export default employee;
