export interface Client {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year?: number;
  plate: string;
  vin?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface DailySchedule {
  date: string;
  jobs: Job[];
}

export interface CreateJobRequest {
  clientName: string;
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  dropOffLocation: string;
}