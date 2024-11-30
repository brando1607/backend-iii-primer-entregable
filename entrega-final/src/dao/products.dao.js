import { productModel } from "../model/products.model.js";

export class ProductDao {
  static async getAll() {
    try {
      const products = await productModel.find();

      if (!products) return { message: "No products yet" };

      return products;
    } catch (error) {
      console.error(error);
    }
  }
  static async getById({ productId }) {
    try {
      const product = await productModel.findById(productId);
      return product;
    } catch (error) {
      if (error.messageFormat === undefined) {
        return { message: `Product not found` };
      }
      console.error(error);
    }
  }
  static async create(product) {
    try {
      const duplicate = await productModel.find({
        name: product.name,
        seller: product.seller,
      });

      if (duplicate.length > 0) {
        return {
          message:
            "seller already has a product with the same name. try updating the stock of the existing one",
        };
      }

      const result = await productModel.create(product);

      return { message: "product created", result };
    } catch (error) {
      console.error(error);
    }
  }
  static async update({ data }) {
    const { id, body, elementsToChange } = data;

    try {
      const product = await productModel.findById(id);

      if (!product) {
        const result = { message: "product not found" };
        return result;
      }

      const updatesToProduct = {};

      elementsToChange.forEach((e) => {
        updatesToProduct[e] = body[e];
      });

      await productModel.findByIdAndUpdate(id, updatesToProduct, {
        new: true,
      });

      const result = { message: `${elementsToChange} changed` };
      return result;
    } catch (error) {
      if (error.messageFormat === undefined) {
        return { message: `User not found` };
      }

      console.error(error);
    }
  }
  static async delete({ productId }) {
    try {
      const product = await productModel.findByIdAndDelete(productId);

      if (!product) return { message: "Product not found" };

      return { message: "product deleted", product };
    } catch (error) {
      console.error(error);
    }
  }
}
