import { axiosInstance } from './instance';
import { Address, PickUpPlace, ReturnPlace } from '../types';

export const createAddress = async (addressData: Omit<Address, 'id'>): Promise<Address> => {
    const response = await axiosInstance.post<Address>('/addresses', {
        country: addressData.country,
        postal_code: addressData.postal_code,
        city: addressData.city,
        street: addressData.street,
        street_number: addressData.street_number
    });
    return response.data;
};

export const createFullPickUpPlace = async (data: {
    name: string;
    country: string;
    postal_code: string;
    city: string;
    street: string;
    street_number: string;
}): Promise<PickUpPlace> => {
    const address = await createAddress(data);
    const response = await axiosInstance.post<PickUpPlace>('/pickUpPlaces', {
        name: data.name,
        addressId: address.id
    });
    return response.data;
};

export const createFullReturnPlace = async (data: {
    name: string;
    country: string;
    postal_code: string;
    city: string;
    street: string;
    street_number: string;
}): Promise<ReturnPlace> => {
    const address = await createAddress(data);
    const response = await axiosInstance.post<ReturnPlace>('/returnPlaces', {
        name: data.name,
        addressId: address.id
    });
    return response.data;
};

export const getPickUpPlaces = async (): Promise<PickUpPlace[]> => {
    try {
        const response = await axiosInstance.get<PickUpPlace[]>('/pickUpPlaces');
        return response.data;
    } catch (error) {
        console.error('Error fetching pickup places:', error);
        return [];
    }
};

export const getReturnPlaces = async (): Promise<ReturnPlace[]> => {
    try {
        const response = await axiosInstance.get<ReturnPlace[]>('/returnPlaces');
        return response.data;
    } catch (error) {
        console.error('Error fetching return places:', error);
        return [];
    }
};
