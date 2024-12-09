import { Request, Response, NextFunction } from "express";
import { User, safeDataValues } from "../models/User";
import { UserSchema, UserLoginSchema, UserRegisterSchema } from "./User.schema";
import { hashPassword, comparePassword, AuthJWT } from "../utils/auth";

const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.log({ error });

    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByPk(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = UserRegisterSchema.validate(req.body);
    if (error) {
      res
        .status(400)
        .json({ message: "Validation error", error: error.details });
      return;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    let user = await User.findOne({ where: { email } });
    if (user) {
      res.status(400).json({
        message: "Validation error",
        error: [{ message: '"email" has already been taken' }],
      });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({
        message: "Validation error",
        error: [{ message: '"password" must be at least 8 characters long' }],
      });
      return;
    }
    if (password !== confirmPassword) {
      res.status(400).json({
        message: "Validation error",
        error: [
          { message: '"confirmPassword" must be the same as "password"' },
        ],
      });
      return;
    }
    user = await User.create({
      name,
      email,
      password: hashPassword(password),
    });
    res.status(201).json(safeDataValues(user));
  } catch (error2) {
    res.status(500).json({ message: "Error al crear usuario", error: error2 });
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = UserLoginSchema.validate(req.body);
    if (error) {
      res
        .status(400)
        .json({ message: "Validation error", error: error.details });
      return;
    }
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      res.status(401).json({ message: "Usuario no encontrado" });
      return;
    }
    if (!comparePassword(req.body.password, (user as any).password)) {
      res.status(401).json({ message: "Contraseña incorrecta" });
      return;
    }
    const authJWT = new AuthJWT();
    const token = authJWT.generateToken({
      userId: (user as any).id,
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

export { list, getUser, register, login };
