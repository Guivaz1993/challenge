import { Prisma, PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { createUsers, listUsers, updateUsers } from '../controllers/users';

const prisma = new PrismaClient();
const routes = Router();

routes.get('/users', listUsers);

routes.post(`/users`, createUsers);

routes.patch('/users/:id', updateUsers);

routes.delete(`/users/:id`, async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });
  res.json(user);
});

routes.post(`/supplier`, async (req, res) => {
  const result = await prisma.supplier.create({
    data: req.body,
  });
  res.json(result);
});

routes.get(`/supplier/:id`, async (req, res) => {
  const { id }: { id?: string } = req.params;

  const supplier = await prisma.supplier.findUnique({
    where: { id: Number(id) },
  });
  res.status(200).json(supplier);
});

routes.patch('/supplier/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedSupplier = await prisma.supplier.update({
      where: { id: Number(id) || undefined },
      data: req.body,
    });
    res.json(updatedSupplier);
  } catch (error) {
    res.json({ error: `Post with ID ${id} does not exist in the database` });
  }
});

routes.delete(`/supplier/:id`, async (req, res) => {
  const { id } = req.params;
  const supplier = await prisma.supplier.delete({
    where: {
      id: Number(id),
    },
  });
  res.json(supplier);
});

// routes.get('/feed', async (req, res) => {
//   const { searchString, skip, take, orderBy } = req.query

//   const or: Prisma.PostWhereInput = searchString
//     ? {
//         OR: [
//           { title: { contains: searchString as string } },
//           { content: { contains: searchString as string } },
//         ],
//       }
//     : {}

//   const posts = await prisma.post.findMany({
//     where: {
//       published: true,
//       ...or,
//     },
//     include: { author: true },
//     take: Number(take) || undefined,
//     skip: Number(skip) || undefined,
//     orderBy: {
//       updatedAt: orderBy as Prisma.SortOrder,
//     },
//   })

//   res.json(posts)
// })

export default routes;
