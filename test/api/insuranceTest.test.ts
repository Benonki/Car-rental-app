import { describe, it, expect, vi } from 'vitest';
import { createInsurance, fetchInsuranceByRentalId } from '../../src/api/insurance';
import { axiosInstance } from '../../src/api/instance';
import type { InsuranceRequest } from '../../src/types';

vi.mock('../../src/api/instance', () => ({
    axiosInstance: {
        post: vi.fn(),
        get: vi.fn(),
    },
}));

const mockInsuranceRequest: InsuranceRequest = {
    rentalId: '1',
    insurance_type: 'PREMIUM',
    cost: 200,
    range_of_insurance: 'FULL_COVERAGE',
};

const mockInsuranceResponse = {
    id: '1',
    rental: {
        id: '1',
    },
    insurance_type: 'PREMIUM',
    cost: 200,
    range_of_insurance: 'FULL_COVERAGE',
};

describe('insurance API functions', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('createInsurance', () => {
        it('should create a new insurance and return it', async () => {
            vi.mocked(axiosInstance.post).mockResolvedValue({ data: mockInsuranceResponse });

            const result = await createInsurance(mockInsuranceRequest);

            expect(axiosInstance.post).toHaveBeenCalledWith('/insurances', mockInsuranceRequest);
            expect(result).toEqual(mockInsuranceResponse);
        });

        it('should throw error when creation fails', async () => {
            vi.mocked(axiosInstance.post).mockRejectedValue(new Error('Network error'));

            await expect(createInsurance(mockInsuranceRequest)).rejects.toThrow('Network error');
        });
    });

    describe('fetchInsuranceByRentalId', () => {
        it('should fetch insurance for a specific rental', async () => {
            vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockInsuranceResponse });

            const result = await fetchInsuranceByRentalId('1');

            expect(axiosInstance.get).toHaveBeenCalledWith('/insurances/1/rental');
            expect(result).toEqual({ data: mockInsuranceResponse });
        });

        it('should throw error when fetch fails', async () => {
            vi.mocked(axiosInstance.get).mockRejectedValue(new Error('Not found'));

            await expect(fetchInsuranceByRentalId('1')).rejects.toThrow('Not found');
        });
    });
});