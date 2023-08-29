import express from "express";
import * as Controllers from "../controllers/controllers.js";

const router = express.Router();

router.route("/").get(Controllers.home);

export default router;
