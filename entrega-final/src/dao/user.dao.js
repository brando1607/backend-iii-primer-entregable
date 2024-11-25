import { userModel } from "../model/user.model.js";
import { createHash, verifyPassword } from "../utils/hashPassword.js";

export class UserDao {
  static async getAll() {
    return await userModel.find();
  }
  static async getById({ userId }) {
    return await userModel.findById(userId);
  }
  static async update({ data }) {
    const { id, body, elementsToChange } = data;

    try {
      const user = await userModel.findById(id);

      if (!user) {
        const result = { message: "user not found" };
        return result;
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

      if (elementsToChange.includes("cart")) {
        delete updatesToUser.cart;
      }

      if (Object.keys(updatesToUser).length > 0) {
        await userModel.findByIdAndUpdate(id, updatesToUser, { new: true });
      }

      const result = {
        message: `${
          elementsToChange.length > 0
            ? `Elements changed, if cart was included, it was not modified`
            : `No elements were sent to modify`
        }`,
        user,
      };
      return result;
    } catch (error) {
      if (error.messageFormat === undefined) {
        return `User not found`;
      }

      console.error(error);
    }
  }
  static async delete({ userId }) {
    try {
      const user = await userModel.findById(userId);

      await user.deleteOne();
      return { message: `user ${user.first_name} deleted` };
    } catch (error) {
      if (error.messageFormat === undefined) {
        return `User not found`;
      }
      console.log(error.messageFormat);

      console.error(error);
    }
  }
}
