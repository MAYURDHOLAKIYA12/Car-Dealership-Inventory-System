import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { VehicleService, vehicleSchema, updateVehicleSchema } from '../services/vehicle.service';

export class VehicleController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const parsed = vehicleSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: 'Validation error',
          errors: parsed.error.format(),
        });
      }

      const vehicle = await VehicleService.createVehicle(parsed.data);
      return res.status(201).json(vehicle);
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      next(error);
    }
  }

  static async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const vehicles = await VehicleService.getAllVehicles();
      return res.status(200).json(vehicles);
    } catch (error) {
      next(error);
    }
  }

  static async search(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { make, model, category, minPrice, maxPrice } = req.query;
      const vehicles = await VehicleService.searchVehicles({
        make: make as string,
        model: model as string,
        category: category as string,
        minPrice: minPrice as string,
        maxPrice: maxPrice as string,
      });
      return res.status(200).json(vehicles);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const parsed = updateVehicleSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: 'Validation error',
          errors: parsed.error.format(),
        });
      }

      const vehicle = await VehicleService.updateVehicle(id, parsed.data);
      return res.status(200).json(vehicle);
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await VehicleService.deleteVehicle(id);
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      next(error);
    }
  }

  static async purchase(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await VehicleService.purchaseVehicle(id);
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      next(error);
    }
  }

  static async restock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const result = await VehicleService.restockVehicle(id, Number(quantity) || 1);
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      next(error);
    }
  }
}
