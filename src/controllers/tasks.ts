import { Request, Response, NextFunction } from "express";
import { Task } from "../models/Task";
import TaskSchema from "./Task.schema";

const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let filters: any = {};
    if (req.query.status) {
      filters.status = req.query.status;
    }
    filters.userId = req.body.userId;
    const tasks = await Task.findAll({
      where: filters,
    });
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
    const task = await Task.create({ status: "pending", ...req.body });
    res.status(201).json(task);
  } catch (error2) {
    res.status(500).json({ message: "Error al crear tarea", error: error2 });
  }
};

const getTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      res.status(404).json({ message: "Tarea no encontrada" });
      return;
    }
    if ((task as any).userId !== req.body.userId) {
      res
        .status(400)
        .json({ message: "No tienes permisos para ver esta tarea" });
      return;
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tarea" });
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = TaskSchema.validate(req.body);
    if (error) {
      res
        .status(400)
        .json({ message: "Validation error", error: error.details });
      return;
    }
    await Task.update(req.body, {
      where: { id: req.params.id, userId: req.body.userId },
    });
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      res.status(404).json({ message: "Tarea no encontrada" });
      return;
    }
    if ((task as any).userId !== req.body.userId) {
      res
        .status(400)
        .json({ message: "No tienes permisos para actualizar esta tarea" });
      return;
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar tarea" });
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      res.status(404).json({ message: "Tarea no encontrada" });
      return;
    }
    if ((task as any).userId !== req.body.userId) {
      res
        .status(400)
        .json({ message: "No tienes permisos para eliminar esta tarea" });
      return;
    }
    try {
      await Task.destroy({
        where: { id: req.params.id },
      });
      res.status(200).json({ message: "Tarea eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar tarea" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar tarea" });
  }
};

export { list, create, getTask, update, remove };
