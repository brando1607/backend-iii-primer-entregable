import { Router } from "express";
import { CartController } from "../controller/cart.controller.js";

export const cartRouter = Router();

cartRouter.delete(
  "/:productId/:amountToRemove/:cartId/remove-product",
  CartController.removeProduct
);

cartRouter.post("/:cartId/purchase", CartController.purchase);

cartRouter.post("/add-to-cart", CartController.addProduct);

cartRouter.delete("/delete/:cartId", CartController.delete);

cartRouter.get("/create", CartController.create);

cartRouter.get("/:cartId", CartController.getById);
