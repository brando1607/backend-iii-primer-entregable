import { GetRepositories } from "../repository/index.repository.js";
import { verifyToken } from "../utils/jwt.js";

export class ProductsController {
  static async create(req, res) {
    const tokenData = verifyToken(req.cookies.token);

    const { name, price, stock } = req.body;

    if (!tokenData) return res.send(`can't create product if not logged in`);

    if (!name || !price || !stock) {
      return res.send("All elements are required");
    }

    const product = {
      name,
      price,
      stock,
      seller: `${tokenData.first_name} ${tokenData.last_name}`,
    };
    const newProduct = await GetRepositories.productRepository.create(product);
    return res.status(200).send(newProduct);
  }
  static async getAll(req, res) {
    try {
      const products = await GetRepositories.productRepository.getAll();

      return res.status(200).send(products);
    } catch (error) {
      console.error(error);
    }
  }
  static async getById(req, res) {
    const { productId } = req.params;
    try {
      const product = await GetRepositories.productRepository.getById({
        productId,
      });
      return res.status(200).send(product);
    } catch (error) {
      console.error(error);
    }
  }
  static async update(req, res) {
    const data = {
      id: req.params.productId,
      body: req.body,
      elementsToChange: Object.keys(req.body),
    };

    try {
      const productUpdated = await GetRepositories.productRepository.update({
        data,
      });
      return res.status(201).send(productUpdated);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  static async delete(req, res) {
    const { productId } = req.params;
    try {
      const result = await GetRepositories.productRepository.delete({
        productId,
      });
      return res.status(201).send(result);
    } catch (error) {
      console.error(error);
    }
  }
}
