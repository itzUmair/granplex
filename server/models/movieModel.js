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
    screenshots: {
      type: [
        {
          type: mongoose.Schema.Types.String,
          required: false,
        },
      ],
      validate: {
        validator: function (value) {
          return value.length <= 5;
        },
        message: "Screenshots array exceeds the maximum length of 5.",
      },
    },
    poster: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
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

const movie = mongoose.model("movie", movieSchema);

export default movie;
