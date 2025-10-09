import React, { useState } from "react";
import type { CreateJobRequest } from "../../types/fleet";
import { fleetService } from "../../services/fleetService";
// missing jobform import - Remember to add it Emanuel

interface jobformProps {
    onJobCreated: () => void; // callback to refresh the schedule after creation
}

export const JobForm: React.FC<jobformProps> = ({ onJobCreated }) => {
    // form atste - initialized with empty values
    const [formFata, setFormData] = useState<CreateJobRequest>({
        clientName: '',
        pickupDate: '',
        pickupTime: '',
        pickupLocations: '',
        dropOffLocation: ''
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    // handle input changes

    const handleInputChange = (field: keyof CreateJobRequest, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // clear messaages when user starts typing again
        if (error) setError(null);
        if (success) setSuccess(false);
    };


    // handle form submission
    const handleSubmit =async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await fleetService.createJob(formFata);
            setSuccess(true);

            // reste form 

            setFormData({
                clientName: '',
                pickupDate: '',
                pickupTime: '',
                pickupLocations: '',
                dropOffLocation: ''
            });

            // notify parent to refresh schedule
            onJobCreated();

            //clear success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to creat job');

        } finally {
            setLoading(false);
        }
    };

    // vheck if form is valid
    const isFormValid= formFata.clientName &&
                     formFata.pickupDate && 
                     formFata.pickupTime && 
                     formFata.pickupLocations && 
                     formFata.dropOffLocation;
    
    return (
        <div className="job-form-container">
            <h2>Schedule New Job</h2>

            {error && (
                <div className="message error">
                    {error}
                </div>
            )}

            {success && (
                <div className="message success">
                    ✅ Job scheduled successfully!
                </div>
            )}

            <form onSubmit={handleSubmit} className="job-form">
                <div className="form-group">
                    <label htmlFor="clientName">Client Name *</label>
                    <input 
                        type="text"
                        id="clientName"
                        value={formFata.clientName}
                        onChange={(e) => handleInputChange('clientName', e.target.value)}
                        placeholder="Enter client name"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="pickupDate">Pickup Date *</label>
                        <input 
                            type="date"
                            id="pickupDate"
                            value={formFata.pickupDate}
                            onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="pickupTime">Pickup Time *</label>
                    <input
                        type="time"
                        id="pickupTime"
                        value={formFata.pickupTime}
                        onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                        required
                        />
                </div>

                <div className="form-group">
                    <label htmlFor="pickupLocations">Pickup Location</label>
                    <input
                        type="text"
                        id="pickupLocations"
                        value={formFata.pickupLocations}
                        onChange={(e) => handleInputChange('pickupLocations', e.target.value)}
                        placeholder="Enetr pickup address"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="dropOffLoaction">Drop-off Location *</label>
                    <input
                        type="text"
                        id="dropOffLocation"
                        value={formFata.dropOffLocation}
                        onChange={(e) => handleInputChange('dropOffLocation', e.target.value)}
                        placeholder="Enter drop-off address"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={!isFormValid || loading}
                    className="submit-btn"
                >
                    {loading ? 'Scheduling...' : 'Schedule Job'}
                </button>
            </form>
        </div>
    );
};
