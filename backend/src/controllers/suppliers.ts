import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

async function createSupplier(req: Request, res: Response) {
  const { logo, name, state, cost, minimumLimit } = req.body;
  try {
    if (!cost || !name || !state || !minimumLimit) {
      return res.status(400).json({
        message: 'Nome, estado, custo e limite minimo são obrigatórios',
      });
    }

    const nameExists = await prisma.supplier.findFirst({ where: { name } });

    if (nameExists) {
      return res.status(400).json({ message: 'Fornecedor já cadastrado' });
    }

    const result = await prisma.supplier.create({
      data: { logo, name, state, cost, minimumLimit },
    });
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

async function listSuppliers(req: Request, res: Response) {
  try {
    const { value = 0 } = req.query;

    const list = await prisma.supplier.findMany({
      where: { minimumLimit: { lte: Number(value) } },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        state: true,
        minimumLimit: true,
        cost: true,
        userSupplier: { select: { rating: true, isActive: true } },
        _count: true,
      },
    });

    const responseList = list.map((supplier) => {
      // const average = averageList.find((iten) => iten.supplierId === supplier.id);
      // const countActive = countList.find((iten) => iten.supplierId === supplier.id);

      const sum = supplier.userSupplier.reduce(function (currentValue, value) {
        return currentValue + (value.rating || 0);
      }, 0);

      const activeUser = supplier.userSupplier.reduce(function (
        currentValue,
        value
      ) {
        return currentValue + (value.isActive ? 1 : 0);
      },
      0);

      const supplierData = Object.assign({}, supplier, {
        avg: sum / supplier.userSupplier.length,
        activeUser,
      });

      return supplierData;
    });

    return res.status(200).json(responseList);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

async function getSupplier(req: Request, res: Response) {
  const { id }: { id?: string } = req.params;
  try {
    if (Number.isNaN(Number(id))) {
      return res
        .status(400)
        .json({ message: "O 'id' de fornecedor é inválido." });
    }

    const supplier = await prisma.supplier.findUnique({
      where: { id: Number(id) },
    });

    if (!supplier) {
      return res.status(404).json({ message: 'Fornecedor não encontrado' });
    }

    return res.status(200).json(supplier);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

async function updateSupplier(req: Request, res: Response) {
  const { logo, name, state, cost, minimumLimit } = req.body;
  const { id } = req.params;
  try {
    if (Number.isNaN(Number(id))) {
      return res
        .status(400)
        .json({ message: "O 'id' de fornecedor é inválido." });
    }

    const updatedSupplier = await prisma.supplier.update({
      where: { id: Number(id) || undefined },
      data: { logo, name, state, cost, minimumLimit },
    });

    return res.status(200).json(updatedSupplier);
  } catch (error: any) {
    if (error.meta.cause === 'Record to update not found.') {
      return res.status(400).json({ message: 'Fornecedor não encontrado' });
    }
    return res.status(400).json({ message: error.message });
  }
}

async function deleteSupplier(req: Request, res: Response) {
  const { id } = req.params;
  try {
    if (Number.isNaN(Number(id))) {
      return res
        .status(400)
        .json({ message: "O 'id' de fornecedor é inválido." });
    }

    const supplier = await prisma.supplier.delete({
      where: {
        id: Number(id),
      },
    });
    return res.status(200).json(supplier);
  } catch (error: any) {
    if (error.meta.cause === 'Record to delete does not exist.') {
      return res.status(400).json({ message: 'Fornecedor não encontrado' });
    }
    return res.status(400).json({ message: error.message });
  }
}

export {
  createSupplier,
  listSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
};
