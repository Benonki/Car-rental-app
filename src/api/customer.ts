import { axiosInstance } from './instance';
import { Customer, Rental } from '../types';

export const fetchCustomerData = async (customerId: string): Promise<Customer> => {
    const response = await axiosInstance.get(`/customers/${customerId}`);
    return response.data;
};

export const fetchCustomerRentals = async (customerId: string): Promise<Rental[]> => {
    const response = await axiosInstance.get(`/rentals/customers/${customerId}`);
    return response.data;
};

export const updatePersonalData = async (personalDataId: string, data: any) => {
    return axiosInstance.patch(`/personalData/${personalDataId}`, data);
};

export const updateAddress = async (addressId: string, data: any) => {
    return axiosInstance.patch(`/addresses/${addressId}`, {
        country: data.country,
        postal_code: data.postal_code,
        city: data.city,
        street: data.street,
        street_number: data.street_number
    });
};