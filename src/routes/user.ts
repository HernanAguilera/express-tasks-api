import express from "express";
import { list, getUser, register, login } from "../controllers/users";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;
