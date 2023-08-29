import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.String,
      maxlength: 50,
      required: true,
    },
    description: {
      type: mongoose.Schema.Types.String,
      maxlength: 500,
      required: true,
    },
    cast: [
      {
        name: {
          type: mongoose.Schema.Types.String,
          required: true,
        },
        role: {
          type: mongoose.Schema.Types.String,
          required: true,
        },
      },
    ],
    releaseDate: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    screenshots: [
      {
        type: mongoose.Schema.Types.String,
        required: false,
      },
    ],
    trailer: {
      type: mongoose.Schema.Types.String,
      required: false,
    },
    ticketPrice: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    nowShowing: {
      type: mongoose.Schema.Types.Boolean,
      required: true,
    },
  },
  { collection: "movies" }
);

const movie = mongoose.model("movieSchema", movieSchema);

export default movie;
