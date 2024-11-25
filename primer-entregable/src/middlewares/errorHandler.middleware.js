import { errors } from "../utils/errors/errors.js";
import { logger } from "../utils/winston.utils.js";

export function errorHandler(error, req, res, next) {
  const message = `${req.method} ${req.url} - ${error.message.toUpperCase()}`;
  if (error.statusCode) {
    logger.error(message);
  } else {
    logger.fatal(message);
    console.error(error);
  }
  const { fatal } = errors;
  return res
    .status(error.statusCode || fatal.statusCode)
    .json({ message: error.message || fatal.message });
}
