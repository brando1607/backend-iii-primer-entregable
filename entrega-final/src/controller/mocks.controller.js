import { faker } from "@faker-js/faker";
import { logger } from "../utils/winston.utils.js";
import { CustomError } from "../utils/errors/customError.utils.js";
import { errors } from "../utils/errors/errors.js";
import { userModel } from "../model/user.model.js";
import { productModel } from "../model/products.model.js";
import { cartModel } from "../model/cart.model.js";

export class MocksController {
  static async createMockUsers(req, res, next) {
    const amount = Number(req.params.n);

    try {
      if (isNaN(amount + 1)) {
        return CustomError.newError(errors.error.wrongType);
      }
      for (let i = 1; i <= amount; i++) {
        let firstName = faker.person.firstName().toLowerCase();
        let lastName = faker.person.lastName().toLowerCase();
        let randomAge = Math.floor(Math.random() * (70 - 18) + 18);
        const newCart = await cartModel.create({ products: [] });

        await userModel.create({
          first_name: firstName,
          last_name: lastName,
          email: firstName + lastName + "@entregable.com",
          age: randomAge,
          password: "hola",
          cart: newCart._id,
        });
      }

      return res.status(201).json({ message: `${amount} user(s) created.` });
    } catch (error) {
      next(error);
    }
  }
  static async getUsers(req, res, next) {
    try {
      const users = await userModel.find();
      if (users.length < 1) {
        return CustomError.newError(errors.noContent);
      } else {
        logger.info(users);

        return res.status(200).json(users);
      }
    } catch (error) {
      next(error);
    }
  }
  static async createMockProducts(req, res) {
    const amount = req.params.n;
    try {
      if (isNaN(amount + 1)) {
        return CustomError.newError(errors.error.wrongType);
      }

      for (let i = 1; i <= amount; i++) {
        let randomStock = Math.floor(Math.random() * (70 - 1) + 1);

        await productModel.create({
          name: faker.commerce.product().toLowerCase(),
          price: faker.commerce.price({ min: 5, max: 200 }),
          stock: randomStock,
          seller: faker.person.fullName(),
        });
      }

      return res.status(201).json({ message: `${amount} produc(s) created.` });
    } catch (error) {
      console.error(error);
    }
  }
  static async getProducts(req, res) {
    try {
      const products = await productModel.find();

      return res.status(200).json(products);
    } catch (error) {
      console.error(error);
    }
  }
}
