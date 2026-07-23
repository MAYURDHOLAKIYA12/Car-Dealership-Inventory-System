import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/utils/prisma';
import { generateToken } from '../src/utils/jwt';

describe('Vehicles API Endpoints (TDD Test Suite)', () => {
  let userToken: string;
  let adminToken: string;
  let createdVehicleId: string;

  beforeAll(async () => {
    await prisma.vehicle.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: {
        username: 'Regular User',
        email: 'user@test.com',
        password: 'hashedpassword',
        role: 'USER',
      },
    });

    const admin = await prisma.user.create({
      data: {
        username: 'Admin User',
        email: 'admin@test.com',
        password: 'hashedpassword',
        role: 'ADMIN',
      },
    });

    userToken = generateToken({ userId: user.id, email: user.email, role: user.role });
    adminToken = generateToken({ userId: admin.id, email: admin.email, role: admin.role });
  });

  afterAll(async () => {
    await prisma.vehicle.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/vehicles (Add vehicle - Admin required or Protected)', () => {
    it('should allow user/admin to create a vehicle with valid data', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'Tesla',
          model: 'Model S',
          year: 2024,
          category: 'Electric',
          price: 89990,
          quantity: 5,
          description: 'Luxury electric sedan',
          imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.make).toBe('Tesla');
      expect(res.body.quantity).toBe(5);
      createdVehicleId = res.body.id;
    });

    it('should reject vehicle creation without token', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .send({
          make: 'BMW',
          model: 'M3',
          year: 2024,
          category: 'Sedan',
          price: 75000,
          quantity: 3,
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/vehicles (List vehicles)', () => {
    it('should return list of all vehicles when authenticated', async () => {
      const res = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should allow unauthenticated guest visitors to view vehicles', async () => {
      const res = await request(app).get('/api/vehicles');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });


  describe('GET /api/vehicles/search (Search vehicles)', () => {
    beforeAll(async () => {
      await prisma.vehicle.createMany({
        data: [
          {
            make: 'Porsche',
            model: '911 GT3',
            year: 2024,
            category: 'Sports',
            price: 180000,
            quantity: 2,
            description: 'Track sports car',
          },
          {
            make: 'Toyota',
            model: 'RAV4',
            year: 2023,
            category: 'SUV',
            price: 32000,
            quantity: 10,
            description: 'Reliable crossover SUV',
          },
        ],
      });
    });

    it('should filter vehicles by make', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?make=Porsche')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].make).toBe('Porsche');
    });

    it('should filter vehicles by category and price range', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?category=SUV&maxPrice=40000')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].model).toBe('RAV4');
    });
  });

  describe('PUT /api/vehicles/:id (Update vehicle)', () => {
    it('should update vehicle details when authenticated', async () => {
      const res = await request(app)
        .put(`/api/vehicles/${createdVehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 84990,
          description: 'Updated description for Tesla Model S',
        });

      expect(res.status).toBe(200);
      expect(res.body.price).toBe(84990);
      expect(res.body.description).toBe('Updated description for Tesla Model S');
    });
  });

  describe('DELETE /api/vehicles/:id (Delete vehicle - Admin only)', () => {
    it('should reject vehicle deletion by non-admin user', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${createdVehicleId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    it('should delete vehicle when requested by admin', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${createdVehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);
    });
  });
});
