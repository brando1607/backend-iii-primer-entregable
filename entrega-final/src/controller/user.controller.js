import { GetRepositories } from "../repository/index.repository.js";
import { CustomError } from "../utils/errors/customError.utils.js";
import { errors } from "../utils/errors/errors.js";

export class UserController {
  static async getAll(req, res, next) {
    try {
      const users = await GetRepositories.userRepository.getAll();
      return res.send(users);
    } catch (error) {
      next(error);
    }
  }
  static async getById(req, res, next) {
    const { userId } = req.params;
    try {
      const user = await GetRepositories.userRepository.getById({ userId });
      return res.status(200).send(user);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  static async update(req, res, next) {
    const data = {
      id: req.params.userId,
      body: req.body,
      elementsToChange: Object.keys(req.body),
    };

    try {
      const userUpdated = await GetRepositories.userRepository.update({ data });
      return res.status(201).send(userUpdated);
    } catch (error) {
      next(error);
    }
  }
  static async logout(req, res, next) {
    try {
      if (!req.cookies.token) {
        return CustomError.newError(errors.error.notLoggedIn);
      }

      res.cookie("token", "", { expires: new Date(0) });
      return res.status(200).send({ message: "Logged out" });
    } catch (error) {
      next(error);
    }
  }
  static async delete(req, res, next) {
    try {
      const { userId } = req.params;

      const userDeleted = await GetRepositories.userRepository.delete({
        userId,
      });
      return res.send(userDeleted);
    } catch (error) {
      next(error);
    }
  }
}
