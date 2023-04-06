import { Router } from 'express';
import {
  deleteUser,
  listUsers,
  updateUsers,
} from '../controllers/users';

const routes = Router();

routes.get('', listUsers);

routes.patch('/:id', updateUsers);

routes.delete('/:id', deleteUser);

export default routes;
