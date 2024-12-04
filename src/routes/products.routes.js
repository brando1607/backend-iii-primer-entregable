import { Router } from "express";
import { ProductsController } from "../controller/products.controller.js";
import { authorization } from "../middlewares/validation.middleware.js";
import { validate, GetDtos } from "../dtos/index.dto.js";
import { passportCall } from "../middlewares/passport.middleware.js";

export const productsRouter = Router();

productsRouter.post(
  "/create-product",
  passportCall("jwt", { session: false }),
  authorization(["admin"]),
  validate(GetDtos.productDto),
  ProductsController.create
);

productsRouter.get("/", ProductsController.getAll);

productsRouter.get("/:productId", ProductsController.getById);

productsRouter.put("/:productId", ProductsController.update);

productsRouter.delete(
  "/:productId",
  passportCall("jwt", { session: false }),
  authorization(["admin"]),
  ProductsController.delete
);
