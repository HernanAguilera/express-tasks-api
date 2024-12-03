import express from "express";
import { list, create, update, remove } from "../controllers/tasks";

const router = express.Router();

router.get("/", list);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
