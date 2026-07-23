import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/utils/prisma';
import { generateToken } from '../src/utils/jwt';

describe('Inventory API Endpoints (Purchase & Restock TDD Suite)', () => {
  let userToken: string;
  let adminToken: string;
  let vehicleId: string;
  let outOfStockVehicleId: string;

  beforeAll(async () => {
    await prisma.vehicle.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: {
        username: 'Buyer User',
        email: 'buyer@test.com',
        password: 'hashedpassword',
        role: 'USER',
      },
    });

    const admin = await prisma.user.create({
      data: {
        username: 'Inventory Admin',
        email: 'invadmin@test.com',
        password: 'hashedpassword',
        role: 'ADMIN',
      },
    });

    userToken = generateToken({ userId: user.id, email: user.email, role: user.role });
    adminToken = generateToken({ userId: admin.id, email: admin.email, role: admin.role });

    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Ford',
        model: 'Mustang Dark Horse',
        year: 2024,
        category: 'Sports',
        price: 60000,
        quantity: 2,
      },
    });
    vehicleId = vehicle.id;

    const zeroStockVehicle = await prisma.vehicle.create({
      data: {
        make: 'Lucid',
        model: 'Air Sapphire',
        year: 2024,
        category: 'Electric',
        price: 249000,
        quantity: 0,
      },
    });
    outOfStockVehicleId = zeroStockVehicle.id;
  });

  afterAll(async () => {
    await prisma.vehicle.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    it('should successfully purchase a vehicle and decrease quantity by 1', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(1);
      expect(res.body.message).toMatch(/purchased/i);
    });

    it('should reject purchase if stock quantity is 0', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${outOfStockVehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/out of stock/i);
    });
  });

  describe('POST /api/vehicles/:id/restock (Admin only)', () => {
    it('should reject restock by standard user', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${outOfStockVehicleId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(403);
    });

    it('should allow admin to restock a vehicle and increase quantity', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${outOfStockVehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(5);
    });
  });
});
