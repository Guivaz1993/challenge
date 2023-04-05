import { Router } from 'express';
import {
  createSupplier,
  deleteSupplier,
  getSupplier,
  listSuppliers,
  updateSupplier,
} from '../controllers/suppliers';

const routes = Router();

routes.post('', createSupplier);

routes.get('', listSuppliers);

routes.get('/:id', getSupplier);

routes.patch('/:id', updateSupplier);

routes.delete('/:id', deleteSupplier);

export default routes;
