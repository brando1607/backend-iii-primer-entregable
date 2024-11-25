import { Router } from "express";
import { CartController } from "../controller/cart.controller.js";
import { validate, GetDtos } from "../dtos/index.dto.js";

export const cartRouter = Router();

cartRouter.delete(
  "/:productId/:amountToRemove/:cartId/remove-product",
  CartController.removeProduct
);

cartRouter.post("/:cartId/purchase", CartController.purchase);

cartRouter.post("/add-to-cart", CartController.addProduct);

cartRouter.delete("/:cartId", CartController.delete);

cartRouter.post("/create", validate(GetDtos.cartDto), CartController.create);

cartRouter.get("/:cartId", CartController.getById);
