import { describe, it, expect, vi } from 'vitest';
import { fetchCustomerData, fetchCustomerRentals, updatePersonalData, updateAddress, updateLoyaltyPoints } from '../../src/api/customer';
import { axiosInstance } from '../../src/api/instance';
import type { Customer, Rental } from '../../src/types';

vi.mock('../../src/api/instance', () => ({
    axiosInstance: {
        get: vi.fn(),
        patch: vi.fn(),
    },
}));

const mockCustomer: Customer = {
    id: '1',
    user: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        provider: 'local',
        providerId: '123',
        enabled: true,
    },
    personalData: {
        id: '1',
        address: {
            id: '1',
            country: 'Poland',
            postal_code: '00-001',
            city: 'Warsaw',
            street: 'Main',
            street_number: '1',
        },
        first_name: 'John',
        last_name: 'Doe',
        pesel: '12345678901',
        id_number: 'ABC123456',
        phone_number: '+48123456789',
        email: 'john@example.com',
    },
    date_of_joining: '2023-01-01',
    loyalty_points: 100,
};

const mockRentals: Rental[] = [
    {
        id: '1',
        car: {
            id: '1',
            model: {
                id: '1',
                name: 'Model S',
                make: { id: '1', name: 'Tesla' },
                bodyType: { id: '1', name: 'Sedan' },
            },
            specification: {
                id: '1',
                yearOfProduction: 2022,
                registration: 'WA12345',
                vin: '12345678901234567',
                color: 'Red',
                numberOfSeats: 5,
                engineCapacity: 0,
                horsepower: 670,
                gearbox: 'Automatic',
                driveType: 'AWD',
                fuelType: 'Electric',
                mileage: 15000,
            },
            cost: 500,
            deposit: 2000,
            availability: 'AVAILABLE',
            image_url: 'tesla.jpg',
            description: 'Electric car',
        },
        date_of_rental: '2023-01-01',
        date_of_return: '2023-01-10',
        total_cost: 4500,
        status: 'COMPLETED',
    },
];

describe('customer API functions', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('fetchCustomerData', () => {
        it('should fetch customer data', async () => {
            vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockCustomer });

            const result = await fetchCustomerData('1');

            expect(axiosInstance.get).toHaveBeenCalledWith('/customers/1');
            expect(result).toEqual(mockCustomer);
        });

        it('should throw error when fetch fails', async () => {
            vi.mocked(axiosInstance.get).mockRejectedValue(new Error('Network error'));

            await expect(fetchCustomerData('1')).rejects.toThrow('Network error');
        });
    });

    describe('fetchCustomerRentals', () => {
        it('should fetch customer rentals', async () => {
            vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockRentals });

            const result = await fetchCustomerRentals('1');

            expect(axiosInstance.get).toHaveBeenCalledWith('/rentals/customers/1');
            expect(result).toEqual(mockRentals);
        });

        it('should return empty array when no rentals found', async () => {
            vi.mocked(axiosInstance.get).mockResolvedValue({ data: [] });

            const result = await fetchCustomerRentals('1');

            expect(result).toEqual([]);
        });
    });

    describe('updatePersonalData', () => {
        it('should update personal data', async () => {
            const updateData = {
                first_name: 'John',
                last_name: 'Smith',
                phone_number: '+48123456789',
            };

            vi.mocked(axiosInstance.patch).mockResolvedValue({ data: { ...mockCustomer.personalData, ...updateData } });

            await updatePersonalData('1', updateData);

            expect(axiosInstance.patch).toHaveBeenCalledWith('/personalData/1', updateData);
        });
    });

    describe('updateAddress', () => {
        it('should update address data', async () => {
            const updateData = {
                country: 'Germany',
                postal_code: '10115',
                city: 'Berlin',
                street: 'Friedrichstrasse',
                street_number: '100',
            };

            vi.mocked(axiosInstance.patch).mockResolvedValue({ data: { ...mockCustomer.personalData.address, ...updateData } });

            await updateAddress('1', updateData);

            expect(axiosInstance.patch).toHaveBeenCalledWith('/addresses/1', {
                country: 'Germany',
                postal_code: '10115',
                city: 'Berlin',
                street: 'Friedrichstrasse',
                street_number: '100',
            });
        });
    });

    describe('updateLoyaltyPoints', () => {
        it('should update loyalty points', async () => {
            vi.mocked(axiosInstance.patch).mockResolvedValue({ data: { ...mockCustomer, loyalty_points: 150 } });

            await updateLoyaltyPoints('1', 150);

            expect(axiosInstance.patch).toHaveBeenCalledWith('/customers/1', {
                loyalty_points: 150,
            });
        });
    });
});