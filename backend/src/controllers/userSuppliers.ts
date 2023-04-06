import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

async function createUserSupplier(req: Request, res: Response) {
  const { id: userId } = req.cookies.user;
  const { supplierId } = req.body;
  try {
    if (!userId || !supplierId) {
      return res.status(400).json({
        message: 'Não foi informado o fornecedor e o usuário.',
      });
    }

    const currentSupplier = await prisma.userSupplier.findFirst({
      where: { userId, supplierId },
    });

    if (currentSupplier?.isActive) {
      return res
        .status(400)
        .json({ message: 'Você já está utilizando esse fornecedor.' });
    }

    if (currentSupplier && !currentSupplier.isActive) {
      const updatedUserSupplier = await prisma.userSupplier.update({
        where: { id: currentSupplier.id },
        data: { isActive: true },
      });

      return res.status(201).json(updatedUserSupplier);
    }

    const insertedUserSupplier = await prisma.userSupplier.create({
      data: { userId, supplierId },
    });
    return res.status(201).json(insertedUserSupplier);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

async function listUserSupplier(req: Request, res: Response) {
  try {
    const list = await prisma.userSupplier.findMany({
      orderBy: { id: 'desc' },
      where: { isActive: true },
      include: {
        Supplier: { select: { name: true } },
        user: { select: { name: true } },
      },
    });

    return res.status(200).json(list);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

async function getUserSupplier(req: Request, res: Response) {
  const { id }: { id?: string } = req.params;
  try {
    if (Number.isNaN(Number(id))) {
      return res.status(400).json({ message: "O 'id' informado é inválido." });
    }

    const userSupplier = await prisma.userSupplier.findUnique({
      where: { id: Number(id) },
    });

    if (!userSupplier) {
      return res
        .status(404)
        .json({ message: 'Informações de contrato não encontradas,' });
    }

    return res.status(200).json(userSupplier);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

async function updateUserSupplier(req: Request, res: Response) {
  const { isActive, rating } = req.body;
  const { id } = req.params;

  try {
    if (Number.isNaN(Number(id))) {
      return res
        .status(400)
        .json({ message: "O 'id' de fornecedor é inválido." });
    }

    if (rating && Number.isNaN(Number(rating))) {
      return res
        .status(400)
        .json({ message: 'A avaliação deve ser uma nota de 0 a 10.' });
    }

    if ((rating && Number(rating) > 10) || Number(rating) < 0) {
      return res
        .status(400)
        .json({ message: 'A avaliação deve ser uma nota de 0 a 10.' });
    }

    const updatedUserSupplier = await prisma.userSupplier.update({
      where: { id: Number(id) || undefined },
      data: { isActive, rating: Number(rating) },
    });

    return res.status(200).json(updatedUserSupplier);
  } catch (error: any) {
    if (error.meta && error.meta.cause === 'Record to update not found.') {
      return res.status(400).json({ message: 'Contrato não encontrado' });
    }
    res.status(400).json({ message: error.message });
  }
}

async function deleteUserSupplier(req: Request, res: Response) {
  const { id } = req.params;
  try {
    if (Number.isNaN(Number(id))) {
      return res.status(400).json({ message: "O 'id' informado é inválido." });
    }

    const userSupplier = await prisma.userSupplier.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json(userSupplier);
  } catch (error: any) {
    if (error.meta.cause === 'Record to delete does not exist.') {
      return res.status(400).json({ message: 'Contrato não encontrado' });
    }
    return res.status(400).json({ message: error.message });
  }
}

export {
  createUserSupplier,
  listUserSupplier,
  getUserSupplier,
  updateUserSupplier,
  deleteUserSupplier,
};
