import mongoose from "mongoose";

const hallSchema = new mongoose.Schema(
  {
    number: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    seats: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    booked: [
      {
        type: mongoose.Schema.Types.String,
        minlength: 2,
        maxLength: 3,
      },
    ],
    schedule: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "movie",
          required: true,
        },
        showTime: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  { collection: "hall" }
);

const hall = mongoose.model("hallSchema", hallSchema);

export default hall;
