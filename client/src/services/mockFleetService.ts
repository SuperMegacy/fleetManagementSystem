import type { Job, CreateJobRequest, DailySchedule } from '../types/fleet';

// Mock data for development when backend is not available
const mockJobs: Job[] = [
  {
    id: '1',
    client: {
      id: '1',
      name: 'ABC Corporation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    clientId: '1',
    pickupDate: '2025-10-09',
    pickupTime: '09:00',
    pickupLocation: '123 Main St, City A',
    dropOffLocation: '456 Oak St, City B',
    status: 'SCHEDULED',
    driver: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    driverId: '1',
    vehicle: {
      id: '1',
      make: 'Ford',
      model: 'Transit',
      year: 2022,
      plate: 'ABC123',
      vin: '1FTRE342X5HA12345',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    vehicleId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    client: {
      id: '2',
      name: 'XYZ Ltd',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    clientId: '2',
    pickupDate: '2025-10-09',
    pickupTime: '14:30',
    pickupLocation: '789 Pine St, City C',
    dropOffLocation: '321 Elm St, City D',
    status: 'SCHEDULED',
    driver: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1987654321',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    driverId: '2',
    vehicle: {
      id: '2',
      make: 'Mercedes-Benz',
      model: 'Sprinter',
      year: 2023,
      plate: 'XYZ789',
      vin: 'WD3RE542X5HA67890',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    vehicleId: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

let nextId = 3;

export const mockFleetService = {
  async createJob(jobData: CreateJobRequest): Promise<Job> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newJob: Job = {
      id: (nextId++).toString(),
      client: {
        id: nextId.toString(),
        name: jobData.clientName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      clientId: nextId.toString(),
      pickupDate: jobData.pickupDate,
      pickupTime: jobData.pickupTime,
      pickupLocation: jobData.pickupLocation,
      dropOffLocation: jobData.dropOffLocation,
      status: 'SCHEDULED',
      driver: undefined,
      driverId: undefined,
      vehicle: undefined,
      vehicleId: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockJobs.push(newJob);
    return newJob;
  },

  async getJobsByDate(date: string): Promise<Job[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockJobs.filter(job => job.pickupDate === date);
  },

  async getDailySchedule(date: string): Promise<DailySchedule> {
    const jobs = await this.getJobsByDate(date);
    return {
      date,
      jobs
    };
  }
};