import { Request, Response, NextFunction } from "express";
import { Task } from "../models/Task";
import TaskSchema from "./Task.schema";

const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await Task.findAll();
    res.status(200).json(tasks);
  } catch (error) {
    console.log({ error });

    res.status(500).json({ error: "Error al obtener tareas" });
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = TaskSchema.validate(req.body);
    if (error) {
      res
        .status(400)
        .json({ message: "Validation error", error: error.details });
      return;
    }
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error2) {
    res.status(500).json({ message: "Error al crear tarea", error: error2 });
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.update(req.body, {
      where: { id: req.params.id },
    });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar tarea" });
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar tarea" });
  }
};

export { list, create, update, remove };
