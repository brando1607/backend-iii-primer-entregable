import { GetRepositories } from "../repository/index.repository.js";

export class UserController {
  static async getAll(req, res) {
    try {
      const users = await GetRepositories.userRepository.getAll();
      return res.send(users);
    } catch (error) {
      console.error(error);
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
  static async logout(req, res) {
    res.cookie("token", "", { expires: new Date(0) });

    return res.status(200).send({ message: "Logged out" });
  }
  static async delete(req, res) {
    const { userId } = req.params;

    const userDeleted = await GetRepositories.userRepository.delete({ userId });
    return res.send(userDeleted);
  }
}
