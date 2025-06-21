import { describe, expect, it, vi, beforeEach } from 'vitest';
import { axiosInstance } from '../../src/api/instance';
import { createRental, createPayment, patchRental, deleteRental, updateRentalStatus } from '../../src/api/rental';
import type { Rental, RentalRequest, PaymentRequest } from '../../src/types';

vi.mock('../../src/api/instance', () => ({
    axiosInstance: {
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('rental API', () => {
    const mockRental: Rental = {
        id: '1',
        car: {
            id: '1',
            model: {
                id: '1',
                name: 'Test Model',
                make: { id: '1', name: 'Test Make' },
                bodyType: { id: '1', name: 'Sedan' },
            },
            specification: {
                id: '1',
                yearOfProduction: 2020,
                registration: 'ABC123',
                vin: 'VIN123456789',
                color: 'Red',
                numberOfSeats: 5,
                engineCapacity: 2000,
                horsepower: 150,
                gearbox: 'Automatic',
                driveType: 'FWD',
                fuelType: 'Gasoline',
                mileage: 50000,
            },
            cost: 100,
            deposit: 500,
            availability: 'Available',
            image_url: 'test.jpg',
            description: 'Test car',
        },
        date_of_rental: '2023-01-01',
        date_of_return: '2023-01-10',
        total_cost: 900,
        status: 'Nadchodzące',
    };

    const mockRentalRequest: RentalRequest = {
        customerId: '1',
        carId: '1',
        date_of_rental: '2023-01-01',
        date_of_return: '2023-01-10',
        pick_up_placeId: '1',
        return_placeId: '1',
        total_cost: 900,
        status: 'Nadchodzące',
        paymentMethod: 'ONLINE',
    };

    const mockPaymentRequest: PaymentRequest = {
        rentalId: '1',
        title: 'Rental Payment',
        cost: 900,
        paymentType: 'ONLINE',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createRental', () => {
        it('should create a rental', async () => {
            vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: mockRental });
            const result = await createRental(mockRentalRequest);

            expect(axiosInstance.post).toHaveBeenCalledWith('/rentals', mockRentalRequest);
            expect(result).toEqual(mockRental);
        });

        it('should throw error when creation fails', async () => {
            const error = new Error('Network error');
            vi.mocked(axiosInstance.post).mockRejectedValueOnce(error);

            await expect(createRental(mockRentalRequest)).rejects.toThrow('Network error');
            expect(axiosInstance.post).toHaveBeenCalledWith('/rentals', mockRentalRequest);
        });
    });

    describe('createPayment', () => {
        it('should create a payment', async () => {
            const mockResponse = { data: { id: '1', status: 'completed' } };
            vi.mocked(axiosInstance.post).mockResolvedValueOnce(mockResponse);
            const result = await createPayment(mockPaymentRequest);

            expect(axiosInstance.post).toHaveBeenCalledWith('/payments', mockPaymentRequest);
            expect(result).toEqual(mockResponse.data);
        });

        it('should throw error when payment creation fails', async () => {
            const error = new Error('Payment failed');
            vi.mocked(axiosInstance.post).mockRejectedValueOnce(error);

            await expect(createPayment(mockPaymentRequest)).rejects.toThrow('Payment failed');
            expect(axiosInstance.post).toHaveBeenCalledWith('/payments', mockPaymentRequest);
        });
    });

    describe('patchRental', () => {
        it('should patch a rental', async () => {
            const payload = { status: 'Zakończone' };
            const mockResponse = { data: { ...mockRental, status: 'Zakończone' } };
            vi.mocked(axiosInstance.patch).mockResolvedValueOnce(mockResponse);

            await patchRental('1', payload);

            expect(axiosInstance.patch).toHaveBeenCalledWith(
                '/rentals/1/status',
                payload
            );
        });

        it('should throw error when patching fails', async () => {
            const error = new Error('Update failed');
            vi.mocked(axiosInstance.patch).mockRejectedValueOnce(error);

            await expect(patchRental('1', {})).rejects.toThrow('Update failed');
        });
    });

    describe('deleteRental', () => {
        it('should delete a rental', async () => {
            vi.mocked(axiosInstance.delete).mockResolvedValueOnce({ data: {} });

            await deleteRental('1');

            expect(axiosInstance.delete).toHaveBeenCalledWith('/rentals/1');
        });

        it('should throw error when deletion fails', async () => {
            const error = new Error('Deletion failed');
            vi.mocked(axiosInstance.delete).mockRejectedValueOnce(error);

            await expect(deleteRental('1')).rejects.toThrow('Deletion failed');
        });
    });

    describe('updateRentalStatus', () => {
        it('should update rental status to "Zakończone"', async () => {
            const mockResponse = { data: { ...mockRental, status: 'Zakończone' } };
            vi.mocked(axiosInstance.patch).mockResolvedValueOnce(mockResponse);

            await updateRentalStatus('1', 'Zakończone');

            expect(axiosInstance.patch).toHaveBeenCalledWith(
                '/rentals/1/status',
                { status: 'Zakończone' }
            );
        });

        it('should update rental status to "Anulowane"', async () => {
            const mockResponse = { data: { ...mockRental, status: 'Anulowane' } };
            vi.mocked(axiosInstance.patch).mockResolvedValueOnce(mockResponse);

            await updateRentalStatus('1', 'Anulowane');

            expect(axiosInstance.patch).toHaveBeenCalledWith(
                '/rentals/1/status',
                { status: 'Anulowane' }
            );
        });

        it('should throw error when status update fails', async () => {
            const error = new Error('Status update failed');
            vi.mocked(axiosInstance.patch).mockRejectedValueOnce(error);

            await expect(updateRentalStatus('1', 'Anulowane')).rejects.toThrow('Status update failed');
        });
    });
});