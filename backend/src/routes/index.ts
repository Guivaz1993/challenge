import { Router } from 'express';
import { tokenVerify } from '../middlewares/tokenValidation';
import suppliersRoutes from './suppliers';
import userRoutes from './users';
import { createUsers, login } from '../controllers/users';

const routes = Router();

routes.post('/login',login)
routes.post('/signup',createUsers)

routes.use(tokenVerify);

routes.use('/users', userRoutes);
routes.use(`/supplier`, suppliersRoutes);

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
