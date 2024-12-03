import express from "express";
import { list, create, update, remove } from "../controllers/tasks";
import { auth } from "../middlewares/auth";

const router = express.Router();

router.get("/", auth, list);
router.post("/", auth, create);
router.put("/:id", auth, update);
router.delete("/:id", auth, remove);

export default router;
