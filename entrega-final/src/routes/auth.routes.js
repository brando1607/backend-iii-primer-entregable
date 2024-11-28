import { Router } from "express";
import { passportCall } from "../middlewares/passport.middleware.js";
import { AuthController } from "../controller/auth.controller.js";
import { validate, GetDtos, partialValidate } from "../dtos/index.dto.js";
export const authRouter = Router();

authRouter.post(
  "/register",
  validate(GetDtos.userDto),
  passportCall("register", {
    session: false,
    failureRedirect: "/api/user/register-fail",
  }),
  AuthController.register
);

authRouter.post("/register-fail", AuthController.registerFail);

authRouter.post(
  "/login",
  partialValidate(GetDtos.userDto),
  passportCall("login", {
    session: false,
    failureRedirect: "/api/auth/login-error",
  }),
  AuthController.login
);

authRouter.get(
  "/current",
  passportCall("jwt", { session: false }),
  AuthController.current
);
