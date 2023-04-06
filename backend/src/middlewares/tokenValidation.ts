import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const jwtSecret = process.env.JWT_SECRET||'Token123';

async function tokenVerify(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      message: 'Usuário não autenticado, por favor faça novamente login.',
    });
  }

  try {
    const token = authorization.replace('Bearer ', '').trim();

    const { id } = jwt.verify(token, jwtSecret);

    const userExists = await prisma.user.findUnique({ where: { id } });

    if (!userExists) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const { password, ...user } = userExists;

    req.cookies.user = user;
    next();
  } catch (error: any) {
    console.log(error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expirado, por favor refaça sua requisição ou login.',
      });
    }
    return res.status(500).json(error);
  }
}

export { tokenVerify };
