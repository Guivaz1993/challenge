import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function listUsers(req: Request, res: Response) {
  const { search } = req.query;
  try {
    const users = await prisma.user.findMany({
      where: { name: { contains: search as string } },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        userSupplier: true,
      },
    });

    const count = await prisma.user.count({
      where: { name: { contains: search as string } },
    });

    return res.status(200).json({ users, count });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

async function createUsers(req: Request, res: Response) {
  const { email, name, password } = req.body;
  try {
    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ message: 'Email, nome e senha são obrigatórios' });
    }

    const emailExists = await prisma.user.findFirst({ where: { email } });

    if (emailExists) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    const encryptedPass = await bcrypt.hash(password, 10);

    const result = await prisma.user.create({
      data: { email, name, password: encryptedPass },
    });
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

async function updateUsers(req: Request, res: Response) {
  const { email, name, password } = req.body;
  const { id } = req.params;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) || undefined },
      data: { email, name, password },
    });

    return res.status(200).json(updatedUser);
  } catch (error: any) {
    if (error.meta.cause === 'Record to update not found.') {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }
    return res.status(400).json({ message: error.message });
  }
}

async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const user = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
    return res.status(200).json(user);
  } catch (error: any) {
    if (error.meta.cause === 'Record to delete does not exist.') {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }
    return res.status(400).json({ message: error.message });
  }
}

async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findFirstOrThrow({ where: { email } });

    const validatePass = await bcrypt.compare(password, user.password);

    if (!validatePass) {
      return res.status(400).json({ message: 'Email e/ou senha incorretos.' });
    }

    const { password: _, ...userData } = user;

    const token = jwt.sign(
      {
        id: userData.id,
        email: userData.email,
      },
      process.env.JWT_SECRET || 'Token123'
    );

    return res.status(200).json({
      user: userData,
      token,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

export { listUsers, createUsers, updateUsers, deleteUser, login };
