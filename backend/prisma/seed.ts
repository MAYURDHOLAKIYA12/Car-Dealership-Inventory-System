import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Car Dealership database...');

  // Clean existing data
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
  const hashedPasswordUser = await bcrypt.hash('user123', 10);

  // Seed Users
  const admin = await prisma.user.create({
    data: {
      username: 'Apex Admin',
      email: 'admin@dealership.com',
      password: hashedPasswordAdmin,
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.create({
    data: {
      username: 'Alex Rivera',
      email: 'user@dealership.com',
      password: hashedPasswordUser,
      role: 'USER',
    },
  });

  console.log('👤 Created default users:');
  console.log('   - Admin: admin@dealership.com (password: admin123)');
  console.log('   - User:  user@dealership.com (password: user123)');

  // Seed Initial Vehicles
  const vehicles = [
    {
      make: 'Porsche',
      model: '911 GT3 RS',
      year: 2024,
      category: 'Sports',
      price: 241300,
      quantity: 2,
      description: 'High-performance sports car engineered for maximum downforce, power, and track precision.',
      imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=80',
    },
    {
      make: 'Tesla',
      model: 'Model S Plaid',
      year: 2024,
      category: 'Electric',
      price: 89990,
      quantity: 4,
      description: 'Tri-motor all-wheel drive flagship sedan with 1,020 horsepower and sub-2 second 0-60 mph acceleration.',
      imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=80',
    },
    {
      make: 'BMW',
      model: 'M4 Competition',
      year: 2023,
      category: 'Coupe',
      price: 79100,
      quantity: 3,
      description: 'Aggressive styling paired with twin-turbo inline 6-cylinder power and M xDrive intelligence.',
      imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80',
    },
    {
      make: 'Mercedes-AMG',
      model: 'G 63',
      year: 2024,
      category: 'Luxury SUV',
      price: 179000,
      quantity: 1,
      description: 'Iconic luxury off-roader featuring hand-crafted AMG V8 biturbo performance.',
      imageUrl: 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1000&q=80',
    },
    {
      make: 'Audi',
      model: 'RS e-tron GT',
      year: 2024,
      category: 'Electric',
      price: 106500,
      quantity: 0, // Intentionally set to 0 to test Out-of-Stock state
      description: 'All-electric gran turismo with sculptural design, dual electric motors, and launch control.',
      imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80',
    },
    {
      make: 'Ford',
      model: 'Mustang Dark Horse',
      year: 2024,
      category: 'Muscle',
      price: 59270,
      quantity: 5,
      description: 'Track-focused 5.0L Coyote V8 muscle coupe delivering 500 horsepower.',
      imageUrl: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1000&q=80',
    },
    {
      make: 'Toyota',
      model: 'GR Supra 3.0',
      year: 2023,
      category: 'Sports',
      price: 54500,
      quantity: 3,
      description: 'Pure driver sports car with 6-speed manual transmission and balanced 50/50 weight distribution.',
      imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  for (const item of vehicles) {
    await prisma.vehicle.create({ data: item });
  }

  console.log(`🚗 Seeded ${vehicles.length} inventory vehicles successfully.`);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
