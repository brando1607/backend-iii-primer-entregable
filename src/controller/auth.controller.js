import { generateToken } from "../utils/jwt.js";

export class AuthController {
  static async register(req, res) {
    const user = req.user;

    return res.status(200).send({ message: "user registered", user });
  }
  static registerFail(req, res) {
    return res.status(401).send(`Register not successul`);
  }

  static async login(req, res) {
    const user = req.user;

    const payload = {
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
    };

    const token = generateToken(payload);

    res.cookie("token", token, {
      maxAge: 1000 * 60 * 3,
      httpOnly: true,
    });
    return res.status(200).send({ message: "Login successfull" });
  }
  static loginError(req, res) {
    return res.status(401).send(`Login not successfull`);
  }
  static async current(req, res) {
    const user = {
      name: `${req.user.first_name} ${req.user.last_name}`,
      age: req.user.age,
    };
    return res.status(200).send({ message: "user is logged in", user: user });
  }
}
