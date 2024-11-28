import { Router } from "express";
import { UserController } from "../controller/user.controller.js";
import { partialValidate } from "../dtos/index.dto.js";
import { GetDtos } from "../dtos/index.dto.js";

export const userRouter = Router();

//rutas de usuario

userRouter.get("/", UserController.getAll);

userRouter.get("/:userId", UserController.getById);

userRouter.delete("/delete/:userId", UserController.delete);

userRouter.put(
  "/:userId",
  partialValidate(GetDtos.userDto),
  UserController.update
);

userRouter.get("/logout", UserController.logout);
