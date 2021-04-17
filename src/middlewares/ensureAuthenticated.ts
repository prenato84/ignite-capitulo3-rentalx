import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new Error("Token is missing!");
  }

  // Bearer eyJhbGciOiJIUzI1NiIsI...
  // Retira-se o Bearer e pega-se a segunda posicao que eh o token em si
  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(
      token,
      "abd44f99172b58564b506e5e1a165d53"
    ) as IPayload;

    const usersRepository = new UsersRepository();
    const user = usersRepository.findById(user_id);

    if (!user) {
      throw new Error("User does not exist!");
    }

    next();
  } catch {
    throw new Error("Invalid token!");
  }
}