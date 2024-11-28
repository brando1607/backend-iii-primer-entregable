import { userModel } from "../model/user.model.js";
import { createHash, verifyPassword } from "../utils/hashPassword.js";
import { CustomError } from "../utils/errors/customError.utils.js";
import { errors } from "../utils/errors/errors.js";

export class UserDao {
  static async getAll() {
    try {
      const users = await userModel.find();

      return users.length > 0 ? users : CustomError.newError(errors.notFound);
    } catch (error) {
      throw error;
    }
  }
  static async getById({ userId }) {
    try {
      if (userId.length !== 24) {
        return CustomError.newError(errors.error.wrongUserId);
      }

      const user = await userModel.findById(userId);

      if (!user) return CustomError.newError(errors.notFound);

      return user;
    } catch (error) {
      console.error(error.reason);
      throw error;
    }
  }
  static async update({ data }) {
    const { id, body, elementsToChange } = data;

    try {
      if (id.length !== 24) {
        return CustomError.newError(errors.error.wrongUserId);
      }

      let user = await userModel.findById(id);

      if (!user) {
        const result = { message: "user not found" };
        return result;
      }

      if (elementsToChange.length < 0) {
        return CustomError.newError(errors.error.empty);
      }

      if (elementsToChange.includes("password")) {
        const passwordIsNotDifferent = await verifyPassword(
          body.password,
          user.password
        );
        if (passwordIsNotDifferent) {
          const result = {
            message: "password can't be the same as current one",
          };
          return result;
        }
        const newPassword = await createHash(body.password);

        await userModel.findByIdAndUpdate(id, {
          password: newPassword,
        });
      }

      const updatesToUser = {};

      elementsToChange.forEach((e) => {
        if (e !== "password") {
          updatesToUser[e] = body[e];
        }
      });

      if (
        elementsToChange.includes("cart") ||
        elementsToChange.includes("id")
      ) {
        delete updatesToUser.cart;
        return CustomError.newError(errors.error.changeNotAllowed);
      }

      if (Object.keys(updatesToUser).length > 0) {
        user = await userModel.findByIdAndUpdate(id, updatesToUser, {
          new: true,
        });
      }

      const result = {
        message: "Elements changed",
        user,
      };
      return result;
    } catch (error) {
      throw error;
    }
  }
  static async delete({ userId }) {
    try {
      if (userId.length !== 24) {
        return CustomError.newError(errors.error.wrongUserId);
      }

      const user = await userModel.findById(userId);

      if (!user) return CustomError.newError(errors.notFound);

      await user.deleteOne();
      return { message: `user ${user.first_name} deleted` };
    } catch (error) {
      throw error;
    }
  }
}
