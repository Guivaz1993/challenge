import { Router } from 'express';
import {
  createUsers,
  deleteUser,
  listUsers,
  updateUsers,
} from '../controllers/users';

const routes = Router();

routes.get('', listUsers);

routes.post('', createUsers);

routes.patch('/:id', updateUsers);

routes.delete('/:id', deleteUser);

export default routes;
