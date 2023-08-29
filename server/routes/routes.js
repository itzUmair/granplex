import express from "express";
import * as Controllers from "../controllers/controllers.js";

const router = express.Router();

router.route("/").get(Controllers.home);
router.route("/user/signup").post(Controllers.signup);
router.route("/admin/signup").post(Controllers.signup);
router.route("/user/signin").post(Controllers.signin);
router.route("/admin/signin").post(Controllers.signin);

export default router;
