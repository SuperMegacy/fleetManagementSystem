// Base types that match our Prisma schema
export interface Client {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year?: number;
  plate: string;
  vin?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  clientId: string;
  client: Client;
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  dropOffLocation: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  driverId?: string;
  driver?: Driver;
  vehicleId?: string;
  vehicle?: Vehicle;
  createdAt: Date;
  updatedAt: Date;
}

// Request/Response types for API
export interface CreateJobRequest {
  clientName: string;
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  dropOffLocation: string;
}

export interface DailySchedule {
  date: string;
  jobs: Job[];
}

export interface UpdateJobStatusRequest {
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface AssignDriverRequest {
  driverId: string;
}

export interface AssignVehicleRequest {
  vehicleId: string;
}