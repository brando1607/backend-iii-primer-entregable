import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { userModel } from "../model/user.model.js";
import { cartModel } from "../model/cart.model.js";
import {
  Strategy as JWTStrategy,
  ExtractJwt as ExtractJWT,
} from "passport-jwt";
import { SECRET_TOKEN } from "../utils/jwt.js";
import { verifyPassword } from "../utils/hashPassword.js";

export function initializePassport() {
  passport.use(
    "register",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, age, role } = req.body;
          if (!first_name || !last_name || !age)
            return done(null, false, {
              mensaje: "All the fields are required",
            });

          const newCart = await cartModel.create({ products: [] });

          const newUser = new userModel({
            first_name,
            last_name,
            email,
            age,
            password,
            role,
            cart: newCart._id,
          });
          const user = await newUser.save();

          return done(null, user);
        } catch (error) {
          if (error.code === 11000) return done("Email already in use");

          return done(error);
        }
      }
    )
  );
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email });

          if (!user) {
            return done(null, false, { message: "User not found" });
          }

          const validPassword = await verifyPassword(password, user.password);

          if (!validPassword) {
            return done(null, false, { message: "Password not valid" });
          }

          return done(null, user);
        } catch (error) {
          return done(error.message);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: SECRET_TOKEN,
      },
      async (payload, done) => {
        try {
          done(null, payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);

    return done(null, user);
  } catch (error) {
    return done(error.message);
  }
});

function cookieExtractor(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.token;
  }
  return token;
}
