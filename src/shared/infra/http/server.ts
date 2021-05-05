import "reflect-metadata";

import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";

import { AppError } from "@shared/errors/AppError";

import { router } from "./routes";

import "@shared/infra/typeorm";

import "@shared/container";

const app = express();

app.use(express.json());

app.use(router);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message}`,
    });

    next();
  }
);

app.listen(3333, () => console.log("Server is running on port: 3333!"));