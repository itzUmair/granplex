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
        movie: {
          type: mongoose.Schema.Types.ObjectId,
          time: mongoose.Schema.Types.Date,
          ref: "movies",
        },
      },
    ],
  },
  { collection: "hall" }
);

const hall = mongoose.model("hallSchema", hallSchema);

export default hall;
