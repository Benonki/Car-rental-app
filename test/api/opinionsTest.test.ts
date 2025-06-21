import { describe, it, expect, vi } from 'vitest';
import { postOpinion, getOpinionsByCarId, getAllOpinions } from '../../src/api/opinions';
import { axiosInstance } from '../../src/api/instance';
import type { Opinion, CreateOpinionDto } from '../../src/types';

vi.mock('../../src/api/instance', () => ({
    axiosInstance: {
        post: vi.fn(),
        get: vi.fn(),
    },
}));

const mockOpinion: Opinion = {
    id: '1',
    customer: {
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
    },
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
    rating: 5,
    description: 'Great car!',
    date_of_publishing: '2023-01-15',
};

const mockOpinions: Opinion[] = [mockOpinion];

describe('opinions API functions', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('postOpinion', () => {
        it('should post a new opinion and return it', async () => {
            const createDto: CreateOpinionDto = {
                customerId: '1',
                carId: '1',
                rating: 5,
                description: 'Great car!',
                date_of_publishing: '2023-01-15',
            };

            vi.mocked(axiosInstance.post).mockResolvedValue({ data: mockOpinion });

            const result = await postOpinion(createDto);

            expect(axiosInstance.post).toHaveBeenCalledWith('/opinions', createDto);
            expect(result).toEqual(mockOpinion);
        });

        it('should throw error when posting fails', async () => {
            const createDto: CreateOpinionDto = {
                customerId: '1',
                carId: '1',
                rating: 5,
                description: 'Great car!',
                date_of_publishing: '2023-01-15',
            };

            vi.mocked(axiosInstance.post).mockRejectedValue(new Error('Network error'));

            await expect(postOpinion(createDto)).rejects.toThrow('Network error');
        });
    });

    describe('getOpinionsByCarId', () => {
        it('should fetch opinions for a specific car', async () => {
            vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockOpinions });

            const result = await getOpinionsByCarId('1');

            expect(axiosInstance.get).toHaveBeenCalledWith('/opinions/car/1');
            expect(result).toEqual(mockOpinions);
        });

        it('should return empty array when no opinions found', async () => {
            vi.mocked(axiosInstance.get).mockResolvedValue({ data: [] });

            const result = await getOpinionsByCarId('1');

            expect(result).toEqual([]);
        });
    });

    describe('getAllOpinions', () => {
        it('should fetch all opinions', async () => {
            vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockOpinions });

            const result = await getAllOpinions();

            expect(axiosInstance.get).toHaveBeenCalledWith('/opinions');
            expect(result).toEqual(mockOpinions);
        });

        it('should return empty array when no opinions exist', async () => {
            vi.mocked(axiosInstance.get).mockResolvedValue({ data: [] });

            const result = await getAllOpinions();

            expect(result).toEqual([]);
        });
    });
});