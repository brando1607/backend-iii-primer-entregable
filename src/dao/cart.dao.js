import { cartModel } from "../model/cart.model.js";
import { userModel } from "../model/user.model.js";
import { productModel } from "../model/products.model.js";
import { randomUUID } from "node:crypto";
import { ticketModel } from "../model/ticket.model.js";
import { sendEmail } from "../config/nodemailer.config.js";

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
        const newCart = await cartModel.create({ products: [] });

        user = await userModel.findByIdAndUpdate(
          user._id,
          { cart: newCart._id },
          { new: true }
        );
      }

      const userCart = await cartModel.findById(user.cart);

      const product = {
        name: body.name,
        price: body.price,
        stock: body.stock,
      };

      //as the body can be sent  directly through the addProduct endpoint, or the create endpoint
      //the value in it can be different. so depending on where it comes from, the product will be
      //looked up accrodingly

      const bodySentThroughAddProduct = product.name ? true : false;

      let productExists = false;

      if (!bodySentThroughAddProduct) {
        try {
          let id = body.products[0]._id;

          productExists = await productModel.findOne({ _id: id });
          if (!productExists) return { messae: "product not in inventory" };
        } catch (error) {
          if (error.messageFormat === undefined) {
            return `Product doesn't exist in inventory but cart created ${userCart}`;
          }
          console.error(error);
        }
      } else {
        try {
          productExists = await productModel.findOne({ name: product.name });

          if (!productExists) return { messae: "product not in inventory" };
        } catch (error) {
          if (error.messageFormat === undefined) {
            return `Product doesn't exist in inventory but cart created ${userCart}`;
          }
          console.error(error);
        }
      }

      const isThisProductInCart = userCart.products.filter(
        (e) => e._id.toString() === productExists._id.toString()
      );

      const productIndex = userCart.products.findIndex(
        (e) => e._id.toString() === productExists._id.toString()
      );

      const isThereStockToAddToCart = productExists.stock < 1 ? false : true;

      if (!isThereStockToAddToCart) {
        return {
          message: `not enough stock to add product to the cart, product can't be added`,
        };
      }

      if (isThisProductInCart.length > 0) {
        if (userCart.products[productIndex].quantity >= productExists.stock) {
          return {
            message: `not enough stock to add product to the cart, product can't be added`,
          };
        }
        userCart.products[productIndex].quantity += 1;
        await userCart.save();
      } else {
        userCart.products.push(productExists._id);
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

  static async create({ tokenData, body }) {
    try {
      const user = await userModel.findOne({ email: tokenData.email });

      if (!tokenData) {
        return { message: `User not found, must be logged in to create cart` };
      }
      const userHasCart = user.cart ? true : false;

      if (userHasCart) {
        return { message: `User already has a cart` };
      } else {
        const newCart = await this.addProduct({ tokenData, body });
        return { message: `Cart created`, newCart };
      }
    } catch (error) {
      console.error(error);
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
