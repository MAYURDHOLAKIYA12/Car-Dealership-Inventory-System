import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { authenticate, optionalAuthenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public / Guest accessible viewing & search
router.get('/', optionalAuthenticate, VehicleController.getAll);
router.get('/search', optionalAuthenticate, VehicleController.search);

// Protected Vehicle CRUD (Authentication required)
router.post('/', authenticate, VehicleController.create);
router.put('/:id', authenticate, VehicleController.update);
router.delete('/:id', authenticate, requireAdmin, VehicleController.delete);

// Protected Inventory actions
router.post('/:id/purchase', authenticate, VehicleController.purchase);
router.post('/:id/restock', authenticate, requireAdmin, VehicleController.restock);

export default router;

