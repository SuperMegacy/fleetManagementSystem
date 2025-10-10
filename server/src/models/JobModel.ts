import prisma from '../services/database';
import { CreateJobRequest } from '../types/fleets';

export const JobModel = {
  // Create a new job
  async create(jobData: CreateJobRequest & { clientName: string }) {
    // Use transaction to ensure data consistency
    return await prisma.$transaction(async (tx) => {
      // Find or create client
      let client = await tx.client.findUnique({
        where: { name: jobData.clientName }
      });

      if (!client) {
        client = await tx.client.create({
          data: { name: jobData.clientName }
        });
      }

      // Create the job
      const { clientName, ...jobDataWithoutClient } = jobData;
      const newJob = await tx.job.create({
        data: {
          ...jobDataWithoutClient,
          clientId: client.id,
          status: 'SCHEDULED'
        },
        include: {
          client: true,
          driver: true,
          vehicle: true
        }
      });

      return newJob;
    });
  },

  // Find jobs by date
  async findByDate(date: string) {
    return await prisma.job.findMany({
      where: { pickupDate: date },
      include: {
        client: true,
        driver: true,
        vehicle: true
      },
      orderBy: { pickupTime: 'asc' }
    });
  },

  // Get all jobs (for debugging)
  async findAll() {
    return await prisma.job.findMany({
      include: {
        client: true,
        driver: true,
        vehicle: true
      },
      orderBy: [{ pickupDate: 'desc' }, { pickupTime: 'asc' }]
    });
  },

  // Get job by ID
  async findById(id: string) {
    return await prisma.job.findUnique({
      where: { id },
      include: {
        client: true,
        driver: true,
        vehicle: true
      }
    });
  },

  // Update job status
  async updateStatus(jobId: string, status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED') {
    return await prisma.job.update({
      where: { id: jobId },
      data: { status },
      include: {
        client: true,
        driver: true,
        vehicle: true
      }
    });
  },

  // Assign driver to job
  async assignDriver(jobId: string, driverId: string) {
    return await prisma.job.update({
      where: { id: jobId },
      data: { driverId },
      include: {
        client: true,
        driver: true,
        vehicle: true
      }
    });
  },

  // Assign vehicle to job
  async assignVehicle(jobId: string, vehicleId: string) {
    return await prisma.job.update({
      where: { id: jobId },
      data: { vehicleId },
      include: {
        client: true,
        driver: true,
        vehicle: true
      }
    });
  },

  // Get all drivers
  async getDrivers() {
    return await prisma.driver.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
  },

  // Get all vehicles
  async getVehicles() {
    return await prisma.vehicle.findMany({
      where: { isActive: true },
      orderBy: { make: 'asc' }
    });
  },

  // Get all clients
  async getClients() {
    return await prisma.client.findMany({
      orderBy: { name: 'asc' }
    });
  },

  // Clear all jobs (for testing)
  async clear() {
    await prisma.job.deleteMany();
    await prisma.client.deleteMany();
  }
};