import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.job.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.client.deleteMany();

  console.log('🗑️ Cleared existing data');

  // Create sample drivers
  const driver1 = await prisma.driver.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@fleet.com',
      phone: '+1-555-0101',
      isActive: true,
    },
  });

  const driver2 = await prisma.driver.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@fleet.com',
      phone: '+1-555-0102',
      isActive: true,
    },
  });

  const driver3 = await prisma.driver.create({
    data: {
      name: 'Mike Johnson',
      email: 'mike.johnson@fleet.com',
      phone: '+1-555-0103',
      isActive: true,
    },
  });

  console.log('👨‍💼 Created drivers');

  // Create sample vehicles
  const vehicle1 = await prisma.vehicle.create({
    data: {
      make: 'Ford',
      model: 'Transit',
      year: 2022,
      plate: 'ABC123',
      vin: '1FTRE342X5HA12345',
      isActive: true,
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      make: 'Mercedes-Benz',
      model: 'Sprinter',
      year: 2023,
      plate: 'XYZ789',
      vin: 'WD3RE542X5HA67890',
      isActive: true,
    },
  });

  const vehicle3 = await prisma.vehicle.create({
    data: {
      make: 'Chevrolet',
      model: 'Express',
      year: 2021,
      plate: 'DEF456',
      vin: '1GCRE342X5HA54321',
      isActive: true,
    },
  });

  console.log('🚚 Created vehicles');

  // Create sample clients
  const client1 = await prisma.client.create({
    data: {
      name: 'ABC Corporation',
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: 'XYZ Manufacturing',
    },
  });

  const client3 = await prisma.client.create({
    data: {
      name: 'Global Logistics Inc',
    },
  });

  const client4 = await prisma.client.create({
    data: {
      name: 'Tech Solutions Ltd',
    },
  });

  console.log('🏢 Created clients');

  // Create sample jobs for today
  const today = new Date().toISOString().split('T')[0];

  const job1 = await prisma.job.create({
    data: {
      clientId: client1.id,
      pickupDate: today,
      pickupTime: '09:00',
      pickupLocation: '123 Main St, Industrial District',
      dropOffLocation: '456 Oak Ave, Business Park',
      status: 'SCHEDULED',
      driverId: driver1.id,
      vehicleId: vehicle1.id,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      clientId: client2.id,
      pickupDate: today,
      pickupTime: '14:30',
      pickupLocation: '789 Commerce Blvd, Downtown',
      dropOffLocation: '321 Factory Rd, Industrial Zone',
      status: 'SCHEDULED',
      driverId: driver2.id,
      vehicleId: vehicle2.id,
    },
  });

  const job3 = await prisma.job.create({
    data: {
      clientId: client3.id,
      pickupDate: today,
      pickupTime: '11:15',
      pickupLocation: '555 Tech Park, Innovation District',
      dropOffLocation: '777 Data Center Rd, Server Farm',
      status: 'IN_PROGRESS',
      driverId: driver3.id,
      vehicleId: vehicle3.id,
    },
  });

  // Create some jobs for tomorrow
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const job4 = await prisma.job.create({
    data: {
      clientId: client4.id,
      pickupDate: tomorrow,
      pickupTime: '10:00',
      pickupLocation: '888 Corporate Center, Financial District',
      dropOffLocation: '999 Executive Blvd, Office Park',
      status: 'SCHEDULED',
    },
  });

  console.log('📅 Created jobs');

  console.log('✅ Seed completed!');
  console.log(`📋 Created ${await prisma.driver.count()} drivers`);
  console.log(`🚚 Created ${await prisma.vehicle.count()} vehicles`);
  console.log(`🏢 Created ${await prisma.client.count()} clients`);
  console.log(`📅 Created ${await prisma.job.count()} jobs`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });