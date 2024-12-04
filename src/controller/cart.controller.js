import { verifyToken } from "../utils/jwt.js";
import { GetRepositories } from "../repository/index.repository.js";

export class CartController {
  static async getById(req, res) {
    const { cartId } = req.params;
    try {
      const userCart = await GetRepositories.carRepository.getById({ cartId });
      return res.status(200).send(userCart);
    } catch (error) {
      console.error(error);
    }
  }
  static async create(req, res) {
    const tokenData = verifyToken(req.cookies.token);
    const body = req.body;

    try {
      const userCreated = await GetRepositories.carRepository.create({
        tokenData,
        body,
      });
      return res.status(200).send(userCreated);
    } catch (error) {
      console.error(error);
    }
  }
  static async addProduct(req, res) {
    const tokenData = verifyToken(req.cookies.token);
    const body = req.body;
    try {
      const productAdded = await GetRepositories.carRepository.addProduct({
        tokenData,
        body,
      });
      return res.status(200).send(productAdded);
    } catch (error) {
      console.error(error);
    }
  }

  static async removeProduct(req, res) {
    const params = req.params;

    try {
      const productRemoved = await GetRepositories.carRepository.removeProduct({
        params,
      });

      return res.status(200).send(productRemoved);
    } catch (error) {
      console.error(error);
    }
  }
  static async purchase(req, res) {
    const { cartId } = req.params;
    try {
      const purchaseCompleted = await GetRepositories.carRepository.purchase({
        cartId,
      });
      return res.status(200).send(purchaseCompleted);
    } catch (error) {
      console.error(error);
    }
  }
  static async delete(req, res) {
    const { cartId } = req.params;

    try {
      const cartDeleted = await GetRepositories.carRepository.delete({
        cartId,
      });
      return res.status(200).send(cartDeleted);
    } catch (error) {
      console.error();
    }
  }
}
