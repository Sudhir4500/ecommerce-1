'use client';
import apiService from '@/app/services/apiservice';
import React, { useEffect, useState } from 'react';

interface AddressFetchProps {
    id: number;
    full_name: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    phone_number: string;
    created_at: string;
    user: string;
}

const AddressFetch = () => {
    const [deliveryAddress, setDeliveryAddress] = useState<AddressFetchProps[]>([]);

    const fetchdata = async () => {
        try {
            console.log('Fetching delivery address...');
            const response = await apiService.get('/api/deliveryaddress/');
            console.log('Raw API Response:', response);
            console.log('Response Data:', response.data);
            console.log('Is Array:', Array.isArray(response.data));

            // Ensure response.data is an array
            if (Array.isArray(response.data)) {
                console.log('Parsed Addresses:', response.data);
                setDeliveryAddress(response.data); // Update state with the array
            } else {
                console.error('Invalid response format: Expected an array');
                setDeliveryAddress([]); // Set to empty array if response is not an array
            }
        } catch (error) {
            console.error('Error fetching delivery address:', error);
            setDeliveryAddress([]); // Handle error by setting an empty array
        }
    };

    useEffect(() => {
        fetchdata();
    }, []);

    return (
        <div>
            <h1 className='font-bold mb-3'>Delivery Address</h1>
            {deliveryAddress.length > 0 ? (
                deliveryAddress.map((address) => (
                    <div key={address.id} className="mb-4">
                        <p>{address.full_name}</p>
                        <p>{address.address}</p>
                        <p>{address.city}, {address.state}, {address.postal_code}</p>
                        <p>{address.phone_number}</p>
                    </div>
                ))
            ) : (
                <p className="mb-4">No delivery address found.</p>
            )}
        </div>
    );
};

export default AddressFetch;