import { cartModel } from "../model/cart.model.js";
import { userModel } from "../model/user.model.js";
import { productModel } from "../model/products.model.js";
import { randomUUID } from "node:crypto";
import { ticketModel } from "../model/ticket.model.js";
import { sendEmail } from "../config/nodemailer.config.js";
import { CustomError } from "../utils/errors/customError.utils.js";
import { errors } from "../utils/errors/errors.js";

export class CartDao {
  static async getById({ cartId }) {
    try {
      return await cartModel.findById(cartId);
    } catch (error) {
      if (error.messageFormat === undefined) {
        return { message: `Cart not found` };
      }
      console.error(error);
    }
  }
  static async addProduct({ tokenData, body }) {
    try {
      let user = await userModel.findOne({ email: tokenData.email });

      if (user.cart === null) {
        return { message: "Cart not found" };
      }

      const userCart = await cartModel.findById(user.cart);

      const product = {
        id: body.id,
        amount: body.amount,
      };

      if (product.id.length !== 24)
        return { message: "ID doesn't have the appropiate length" };

      let productExists = await productModel.findOne({ _id: product.id });

      if (!productExists) return { message: "product not in inventory" };

      const isThisProductInCart = userCart.products.filter(
        (e) => e._id.toString() === productExists._id.toString()
      );

      const productIndex = userCart.products.findIndex(
        (e) => e._id.toString() === productExists._id.toString()
      );

      const isThereStockToAddToCart = productExists.stock < 1 ? false : true;

      if (!isThereStockToAddToCart) {
        return {
          message: `not enough stock to add product to the cart, product can't be added.`,
        };
      }
      if (isThisProductInCart.length > 0) {
        let amountOfProductInCart = userCart.products[productIndex].quantity;

        if (amountOfProductInCart + product.amount > productExists.stock) {
          return {
            message: `You curently have ${amountOfProductInCart} of this product in your cart and are trying to add ${product.amount} more. However, the product's stock is ${productExists.stock}, please add a lower amount or wait until there is more stock.`,
          };
        }

        userCart.products[productIndex].quantity += product.amount;
        await userCart.save();
      } else {
        if (product.amount > productExists.stock) {
          return {
            message: "Can't add an amount greater than what's in stock",
          };
        }

        userCart.products.push({
          _id: product.id,
          quantity: product.amount,
        });
        await userCart.save();
      }
      const result = {
        message: "product added",
        cart: userCart,
      };

      return result;
    } catch (error) {
      console.error(error);
    }
  }

  static async create({ tokenData }) {
    try {
      const user = await userModel.findOne({ email: tokenData.email });

      const userHasCart = user.cart ? true : false;

      if (userHasCart) {
        return CustomError.newError(errors.error.cart);
      } else {
        const newCart = await cartModel.create({ products: [] });

        await userModel.findOneAndUpdate(
          { _id: user._id },
          { cart: newCart },
          { new: true }
        );

        return { message: `Cart created`, newCart };
      }
    } catch (error) {
      throw error;
    }
  }
  static async delete({ cartId }) {
    try {
      await cartModel.findByIdAndDelete(cartId);

      const cartOwner = await userModel.findOne({ cart: cartId });

      await userModel.findByIdAndUpdate(cartOwner._id, { cart: null });
      return { message: `cart deleted` };
    } catch (error) {
      if (error.messageFormat === undefined) {
        return { message: `Cart not found` };
      }
      console.error(error);
    }
  }
  static async removeProduct({ params }) {
    const { productId, amountToRemove, cartId } = params;

    try {
      const userCart = await cartModel.findById(cartId);

      const itemToRemove = await productModel.findById(productId);

      if (!userCart || !itemToRemove) {
        const result = "product or cart not found";
        return { message: result };
      }

      const productIndex = userCart.products.findIndex(
        (e) => e._id.toString() === itemToRemove._id.toString()
      );

      if (amountToRemove < 1) {
        const result = `Amount to remove has to be at least one.`;
        return { message: result };
      }

      const productIsInCart = userCart.products.filter(
        (e) => e._id.toString() === productId
      );

      if (productIsInCart.length === 0) {
        const result = "product not in cart";
        return { message: result };
      }

      if (Number(amountToRemove) > userCart.products[productIndex].quantity) {
        const result =
          "amount to remove can't be higher than the amount of the product in the cart";
        return { message: result };
      }

      userCart.products[productIndex].quantity -= Number(amountToRemove);

      //update amount of products in cart

      const updatedProductsInCart = userCart.products.filter(
        (e) => e.quantity > 0
      );

      userCart.products = updatedProductsInCart;
      userCart.save();

      if (userCart.products.length === 0) {
        const result = {
          message:
            "cart has been emptied. Go back to the home page to add more",
          userCart,
        };
        return result;
      }
      const result = { message: `${amountToRemove} item(s) removed from cart` };
      return result;
    } catch (error) {
      console.error(error);
    }
  }
  static async purchase({ cartId }) {
    try {
      const userCart = await cartModel.findById(cartId);

      if (!userCart) return { message: "cart not found" };

      const promises = userCart.products.map(async (e) => {
        return await productModel.findById(e._id);
      });

      const productsInCart = await Promise.all(promises);

      //if for any reason, the cart has items that are no longer in inventory
      //they're removed so we can continue the process with the ones that
      //can be bought

      const productsInStock = productsInCart.filter((e) => e !== null);

      if (productsInStock.length === 0) {
        return {
          message:
            "the products in the cart are not available to purchase. Wait until they are available again, or empty the cart",
        };
      }

      const productWithNotEnoughStock = [];
      const pendingPurchase = [];

      //check if there is enough stock for the amount of products in the cart and update it

      for (const purchase of productsInStock) {
        const product = userCart.products.find(
          (p) => p._id.toString() === purchase._id.toString()
        );

        const productIndex = userCart.products.findIndex(
          (e) => e._id.toString() === product._id.toString()
        );

        if (purchase.stock >= product.quantity) {
          await productModel.findByIdAndUpdate(purchase._id, {
            stock: (purchase.stock -= product.quantity),
          });

          userCart.products.splice(productIndex, 1);

          await cartModel.findByIdAndUpdate(userCart._id, {
            products: userCart.products,
          });
        } else if (purchase.stock < product.quantity && purchase.stock > 0) {
          userCart.products[productIndex].quantity -= purchase.stock;

          await productModel.findByIdAndUpdate(purchase._id, { stock: 0 });

          productWithNotEnoughStock.push(purchase.name);
          pendingPurchase.push(purchase._id);
        } else {
          productWithNotEnoughStock.push(purchase.name);
        }
        await userCart.save();
      }

      for (const product of userCart.products) {
        if (!productsInStock.includes(product)) {
          productWithNotEnoughStock.push(product._id);
        }
      }

      // generate ticket
      let amount = 0;

      for (const product of productsInStock) {
        amount += product.price * product.stock;
      }
      const productsPurchased = productsInStock.map((e) => e.name);
      const code = randomUUID();
      const user = await userModel.findOne({ cart: cartId });
      const buyer = user._id.toString();

      const ticket = await ticketModel.create({
        code,
        amount,
        products: productsPurchased,
        buyer,
      });

      //send ticket in an email

      const text = `        
            <h3 style="font-size: 16px; color: red">Thank you for doing business with us ${
              user.first_name
            }</h3>
            
            <p style="font-size: 16px; color: red"> Here's a breakdown of what you bought: </p>
    
            <p style="font-size: 16px; color: red"> Products: ${productsPurchased} </p>
            <p style="font-size: 16px; color: red"> Total amount spent: $${amount} </p>
            <p style="font-size: 16px; color: red"> Your confirmation number is: ${code} </p>
    
            <p style="font-size: 16px; color: red"> ${
              productWithNotEnoughStock.length > 0
                ? `make sure you come back to complete these pending purchases. Stock will be updated soon`
                : "They will arrive as soon as possible"
            } </p>
    
            <p style="font-size: 16px; color: red"> We thank you very much for your purchase, and hope you come back soon!  </p>
            `;
      await sendEmail(user.email, text);

      if (productWithNotEnoughStock.length > 0) {
        return {
          message: `payment processed, the ticket is visible here and you'll get it in an email as well. however the following product(s) couldn't be bought due to lack of stock: ${productWithNotEnoughStock}. ${
            pendingPurchase.length > 0
              ? `${pendingPurchase.map(
                  (e) => e
                )} - products that can be bought when there's stock`
              : "no pending purchases"
          }`,
          ticket: ticket,
        };
      }

      const result = {
        message:
          "purchase completed, the ticket is visible here and you'll get it in an email as well.",
        ticket: ticket,
      };
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}
