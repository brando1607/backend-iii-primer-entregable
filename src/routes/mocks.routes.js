import { Router } from "express";
import { MocksController } from "../controller/mocks.controller.js";
export const mocksRouter = Router();

mocksRouter.get("/users/:n", MocksController.createMockUsers);

mocksRouter.get("/users", MocksController.getUsers);

mocksRouter.get("/products/:n", MocksController.createMockProducts);

mocksRouter.get("/products", MocksController.getProducts);
