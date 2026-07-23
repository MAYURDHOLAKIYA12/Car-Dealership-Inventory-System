import { prisma } from '../utils/prisma';
import { z } from 'zod';

export const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().int().min(1900).max(2030).default(2024),
  category: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().min(0, 'Quantity cannot be negative').default(1),
  description: z.string().optional().default(''),
  imageUrl: z.string().optional().default(''),
});

export const updateVehicleSchema = vehicleSchema.partial();

export interface SearchQuery {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
}

export class VehicleService {
  static async createVehicle(data: z.infer<typeof vehicleSchema>) {
    return prisma.vehicle.create({
      data,
    });
  }

  static async getAllVehicles() {
    return prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async searchVehicles(query: SearchQuery) {
    const where: any = {};

    if (query.make) {
      where.make = { contains: query.make };
    }

    if (query.model) {
      where.model = { contains: query.model };
    }

    if (query.category) {
      where.category = { contains: query.category };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) {
        where.price.gte = Number(query.minPrice);
      }
      if (query.maxPrice !== undefined) {
        where.price.lte = Number(query.maxPrice);
      }
    }

    return prisma.vehicle.findMany({
      where,
      orderBy: { price: 'asc' },
    });
  }

  static async updateVehicle(id: string, data: z.infer<typeof updateVehicleSchema>) {
    const existing = await prisma.vehicle.findUnique({ where: { id } });
    if (!existing) {
      throw { status: 404, message: 'Vehicle not found' };
    }

    return prisma.vehicle.update({
      where: { id },
      data,
    });
  }

  static async deleteVehicle(id: string) {
    const existing = await prisma.vehicle.findUnique({ where: { id } });
    if (!existing) {
      throw { status: 404, message: 'Vehicle not found' };
    }

    await prisma.vehicle.delete({ where: { id } });
    return { message: 'Vehicle deleted successfully' };
  }

  static async purchaseVehicle(id: string) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });

    if (!vehicle) {
      throw { status: 404, message: 'Vehicle not found' };
    }

    if (vehicle.quantity <= 0) {
      throw { status: 400, message: 'Vehicle is currently out of stock.' };
    }

    const updated = await prisma.vehicle.update({
      where: { id },
      data: {
        quantity: vehicle.quantity - 1,
      },
    });

    return {
      message: 'Vehicle purchased successfully!',
      quantity: updated.quantity,
      vehicle: updated,
    };
  }

  static async restockVehicle(id: string, addQuantity: number) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });

    if (!vehicle) {
      throw { status: 404, message: 'Vehicle not found' };
    }

    const qtyToAdd = typeof addQuantity === 'number' && addQuantity > 0 ? addQuantity : 1;

    const updated = await prisma.vehicle.update({
      where: { id },
      data: {
        quantity: vehicle.quantity + qtyToAdd,
      },
    });

    return {
      message: `Vehicle restocked by ${qtyToAdd} units.`,
      quantity: updated.quantity,
      vehicle: updated,
    };
  }
}
