import { Router } from 'express';
import {
  createUserSupplier,
  deleteUserSupplier,
  getUserSupplier,
  listUserSupplier,
  updateUserSupplier,
} from '../controllers/userSuppliers';

const routes = Router();

routes.post('', createUserSupplier);

routes.get('', listUserSupplier);

routes.get('/:id', getUserSupplier);

routes.patch('/:id', updateUserSupplier);

routes.delete('/:id', deleteUserSupplier);

export default routes;
