import express from "express";
import cookieParser from "cookie-parser";
import { winston } from "./middlewares/winston.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import passport from "passport";
import { dbConnection } from "./config/mongoConfig.js";
import { router } from "./routes/index.routes.js";
import { initializePassport } from "./config/passport.config.js";
import { env } from "./utils/env.utils.js";

//Express config
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(winston);

//mongo config
dbConnection();

//passport config
initializePassport();
app.use(passport.initialize());

//Servidor
app.listen(env.PORT, () => {
  console.log(`Server listening on port http://localhost:${env.PORT}`);
});

//router config
app.use("/api", router);
app.use(errorHandler);
