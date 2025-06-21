import { describe, expect, it, vi } from 'vitest';
import { axiosInstance } from '../../src/api/instance';
import { createAddress, createFullPickUpPlace, createFullReturnPlace, getPickUpPlaces, getReturnPlaces } from '../../src/api/locations';
import type { Address, PickUpPlace, ReturnPlace } from '../../src/types';

vi.mock('../../src/api/instance', () => ({
    axiosInstance: {
        post: vi.fn(),
        get: vi.fn(),
    },
}));

beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('locations API', () => {
    const mockAddress: Address = {
        id: '1',
        country: 'Poland',
        postal_code: '00-001',
        city: 'Warsaw',
        street: 'Main Street',
        street_number: '10',
    };

    const mockPickUpPlace: PickUpPlace = {
        id: '1',
        name: 'Main Pickup',
        address: mockAddress,
    };

    const mockReturnPlace: ReturnPlace = {
        id: '1',
        name: 'Main Return',
        address: mockAddress,
    };

    describe('createAddress', () => {
        it('should create an address', async () => {
            const addressData = {
                country: 'Poland',
                postal_code: '00-001',
                city: 'Warsaw',
                street: 'Main Street',
                street_number: '10',
            };

            vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: mockAddress });
            const result = await createAddress(addressData);

            expect(axiosInstance.post).toHaveBeenCalledWith('/addresses', {
                country: 'Poland',
                postal_code: '00-001',
                city: 'Warsaw',
                street: 'Main Street',
                street_number: '10',
            });
            expect(result).toEqual(mockAddress);
        });
    });

    describe('createFullPickUpPlace', () => {
        it('should create a full pickup place with address', async () => {
            const placeData = {
                name: 'Main Pickup',
                country: 'Poland',
                postal_code: '00-001',
                city: 'Warsaw',
                street: 'Main Street',
                street_number: '10',
            };

            vi.mocked(axiosInstance.post)
                .mockResolvedValueOnce({ data: mockAddress }) // createAddress
                .mockResolvedValueOnce({ data: mockPickUpPlace }); // createPickUpPlace

            const result = await createFullPickUpPlace(placeData);

            expect(axiosInstance.post).toHaveBeenCalledWith('/addresses', {
                country: 'Poland',
                postal_code: '00-001',
                city: 'Warsaw',
                street: 'Main Street',
                street_number: '10',
            });
            expect(axiosInstance.post).toHaveBeenCalledWith('/pickUpPlaces', {
                name: 'Main Pickup',
                addressId: '1',
            });
            expect(result).toEqual(mockPickUpPlace);
        });
    });

    describe('createFullReturnPlace', () => {
        it('should create a full return place with address', async () => {
            const placeData = {
                name: 'Main Return',
                country: 'Poland',
                postal_code: '00-001',
                city: 'Warsaw',
                street: 'Main Street',
                street_number: '10',
            };

            vi.mocked(axiosInstance.post)
                .mockResolvedValueOnce({ data: mockAddress }) // createAddress
                .mockResolvedValueOnce({ data: mockReturnPlace }); // createReturnPlace

            const result = await createFullReturnPlace(placeData);

            expect(axiosInstance.post).toHaveBeenCalledWith('/addresses', {
                country: 'Poland',
                postal_code: '00-001',
                city: 'Warsaw',
                street: 'Main Street',
                street_number: '10',
            });
            expect(axiosInstance.post).toHaveBeenCalledWith('/returnPlaces', {
                name: 'Main Return',
                addressId: '1',
            });
            expect(result).toEqual(mockReturnPlace);
        });
    });

    describe('getPickUpPlaces', () => {
        it('should fetch pickup places', async () => {
            vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: [mockPickUpPlace] });
            const result = await getPickUpPlaces();

            expect(axiosInstance.get).toHaveBeenCalledWith('/pickUpPlaces');
            expect(result).toEqual([mockPickUpPlace]);
        });

        it('should return empty array and log error on failure', async () => {
            const error = new Error('Network error');
            vi.mocked(axiosInstance.get).mockRejectedValueOnce(error);

            const result = await getPickUpPlaces();

            expect(axiosInstance.get).toHaveBeenCalledWith('/pickUpPlaces');
            expect(result).toEqual([]);
            expect(console.error).toHaveBeenCalledWith('Error fetching pickup places:', error);
        });
    });

    describe('getReturnPlaces', () => {
        it('should fetch return places', async () => {
            vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: [mockReturnPlace] });
            const result = await getReturnPlaces();

            expect(axiosInstance.get).toHaveBeenCalledWith('/returnPlaces');
            expect(result).toEqual([mockReturnPlace]);
        });

        it('should return empty array and log error on failure', async () => {
            const error = new Error('Network error');
            vi.mocked(axiosInstance.get).mockRejectedValueOnce(error);

            const result = await getReturnPlaces();

            expect(axiosInstance.get).toHaveBeenCalledWith('/returnPlaces');
            expect(result).toEqual([]);
            expect(console.error).toHaveBeenCalledWith('Error fetching return places:', error);
        });
    });
});