import { Router } from "express";
import registerUser from "../controllers/user.controller.js";

const router = Router()
// router.route("/login").post(loginUser)

router.route("/api/v1/users").post(registerUser)
export default router;