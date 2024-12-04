import { Router } from "express";
import { MocksController } from "../controller/mocks.controller.js";
export const mocksRouter = Router();

mocksRouter.post("/users/:n", MocksController.createMockUsers);

mocksRouter.get("/users", MocksController.getUsers);

mocksRouter.post("/products/:n", MocksController.createMockProducts);

mocksRouter.get("/products", MocksController.getProducts);
