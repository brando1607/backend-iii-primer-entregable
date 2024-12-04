import { ProductDao } from "./products.dao.js";
import { CartDao } from "./cart.dao.js";
import { UserDao } from "./user.dao.js";

export class GetDaos {
  static productDao = ProductDao;
  static cartDao = CartDao;
  static userDao = UserDao;
}
