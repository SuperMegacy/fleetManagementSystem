// this file represents a shedules in the fleet system 

export interface ScheduledJob {
    id?: string;
    clientName: string;
    pickupDate: string;
    pickupTime: string;
    pickupLocation: string;
    dropOffLocation: string;
    // remember to add driver and vehicle assignment later
    assignedDriver?: string;
    assignedVehicle?: string;
    status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';

}

// what managers will see on the schedule page
export interface DailySchedule {
    date: string;
    jobs: ScheduledJob[]; // all jobs for that date
}

// For creating new scheduked ijobs
export interface CreateJobRequest {
    clientName: string;
    pickupDate: string;
    pickupTime: string;
    pickupLocations: string;
    dropOffLocation: string; 
}