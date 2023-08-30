import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./database/database.js";
import router from "./routes/routes.js";
import * as Middlewares from "./middleware/middleware.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "*",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(Middlewares.authentication);
app.use(Middlewares.logger);
app.use(express.json());
app.use("/api/v1", router);

const createServer = async () => {
  try {
    await connectDB();
    console.log("starting server on: http://localhost:8080");
    app.listen(8080, () =>
      console.log("server started on: http://localhost:8080")
    );
  } catch (error) {
    console.log(error);
  }
};

createServer();
