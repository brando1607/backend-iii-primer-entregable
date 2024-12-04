import { logger } from "../utils/winston.utils.js";

export function winston(req, res, next) {
  try {
    req.logger = logger;
    const message = `${req.method} ${req.url}`;
    req.logger.http(message);
    return next();
  } catch (error) {
    return next(error);
  }
}
