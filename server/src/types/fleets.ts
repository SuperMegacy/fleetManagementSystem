// matching the front end types
export interface ScheduledJob {
    id?: string;
    clientName: string;
    pickedDate: string;
    pickupTime: string;
    pickupLocation: string;
    dropOffLocations: string;
    assignedDriver?: string;
    assignedVehicle?: string;
    status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

export interface CreateJobRequest {
    clientName: string;
    pickupDate: string;
    pickupTime: string;
    pickupLocation: string;
    dropOffLocation: string;
}