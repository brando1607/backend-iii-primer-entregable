import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { userRouter } from "./user.routes.js";
import { cartRouter } from "./cart.routes.js";
import { mocksRouter } from "./mocks.routes.js";
import { productsRouter } from "./products.routes.js";

export const router = Router();

//router config
router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/products", productsRouter);
router.use("/cart", cartRouter);
router.use("/mocks", mocksRouter);
