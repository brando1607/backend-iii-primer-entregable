import { Router } from "express";
import { UserController } from "../controller/user.controller.js";
import { partialValidate } from "../dtos/index.dto.js";
import { GetDtos } from "../dtos/index.dto.js";
import { passportCall } from "../middlewares/passport.middleware.js";

export const userRouter = Router();

//rutas de usuario

userRouter.get("/getAllUsers", UserController.getAll);

userRouter.get("/getOneUser/:userId", UserController.getById);

userRouter.delete("/delete/:userId", UserController.delete);

userRouter.put(
  "/:userId",
  passportCall("jwt", { session: false }),
  partialValidate(GetDtos.userDto),
  UserController.update
);

userRouter.get("/logout", UserController.logout);
