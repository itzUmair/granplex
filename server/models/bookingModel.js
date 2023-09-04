import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    bookedOn: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    bookedFor: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "movies",
      required: true,
    },
    tickets: [
      {
        type: mongoose.Schema.Types.String,
        minlength: 2,
        maxLength: 3,
        required: true,
      },
    ],
  },
  { collection: "bookings" }
);

const booking = mongoose.model("booking", bookingSchema);

export default booking;
