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
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

async function listSuppliers(req: Request, res: Response) {
  try {
    const list = await prisma.supplier.findMany({ orderBy: { name: 'asc' } });

    const averageList = await prisma.userSupplier.groupBy({
      by: ['supplierId'],
      _avg: { rating: true },
      _count: { _all: true },
    });

    const responseList = list.map((supplier) => {
      const data = averageList.find((iten) => iten.supplierId === supplier.id);

      const supplierData = Object.assign({}, supplier, {
        count: data?._count._all || 0,
        avg: data?._avg.rating || 0,
      });

      return supplierData;
    });

    res.status(200).json(responseList);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
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

    res.status(200).json(supplier);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
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

    res.status(200).json(updatedSupplier);
  } catch (error: any) {
    if (error.meta.cause === 'Record to update not found.') {
      return res.status(400).json({ message: 'Fornecedor não encontrado' });
    }
    res.status(400).json({ message: error.message });
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
    res.status(200).json(supplier);
  } catch (error: any) {
    if (error.meta.cause === 'Record to delete does not exist.') {
      return res.status(400).json({ message: 'Fornecedor não encontrado' });
    }
    res.status(400).json({ message: error.message });
  }
}

export {
  createSupplier,
  listSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
};
