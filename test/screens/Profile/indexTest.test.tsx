import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Profile from '../../../src/screens/Profile';
import { useUser } from '../../../src/contexts/UserContext';
import { fetchCustomerData, fetchCustomerRentals, updateLoyaltyPoints } from '../../../src/api/customer';
import { getAllOpinions, postOpinion } from '../../../src/api/opinions';
import { patchRental } from '../../../src/api/rental';
import { fetchInsuranceByRentalId } from '../../../src/api/insurance';

vi.mock('../../../src/contexts/UserContext');
vi.mock('../../../src/api/customer');
vi.mock('../../../src/api/opinions');
vi.mock('../../../src/api/rental');
vi.mock('../../../src/api/insurance');

beforeAll(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation((msg) => {
        if (
            typeof msg === 'string' &&
            (
                msg.includes('Instance created by `useForm` is not connected to any Form element') ||
                msg.includes('antd')
            )
        ) {
            return;
        }
        console.log(msg);
    });
});

afterAll(() => {
    vi.restoreAllMocks();
});

const mockCustomer = {
    id: '1',
    user: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        provider: 'local',
        providerId: '1',
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
        phone_number: '123456789',
        email: 'john@example.com',
    },
    date_of_joining: '2023-01-01',
    loyalty_points: 500,
};

const mockRentals = [
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
                mileage: 10000,
            },
            cost: 500,
            deposit: 1000,
            availability: 'AVAILABLE',
            image_url: '',
            description: '',
        },
        date_of_rental: '2023-01-01',
        date_of_return: '2023-01-10',
        total_cost: 4500,
        status: 'Zakończone',
    },
];

const mockOpinions = [
    {
        id: '1',
        customer: mockCustomer,
        car: mockRentals[0].car,
        rating: 5,
        description: 'Great car!',
        date_of_publishing: '2023-01-15',
    },
];

describe('Profile Screen', () => {
    beforeEach(() => {
        vi.mocked(useUser).mockReturnValue({
            customerId: '1',
            username: 'john@example.com',
            setUsername: vi.fn(),
            setCustomerId: vi.fn(),
            logout: vi.fn(),
        });
        vi.mocked(updateLoyaltyPoints).mockResolvedValue({} as any);
        vi.mocked(fetchCustomerData).mockResolvedValue(mockCustomer);
        vi.mocked(fetchCustomerRentals).mockResolvedValue(mockRentals);
        vi.mocked(getAllOpinions).mockResolvedValue(mockOpinions);
        vi.mocked(postOpinion).mockResolvedValue({} as any);
        vi.mocked(patchRental).mockResolvedValue({} as any);
        vi.mocked(fetchInsuranceByRentalId).mockResolvedValue({
            data: {
                id: '1',
                rental: { id: '1' },
                insurance_type: 'PREMIUM',
                cost: 300,
                range_of_insurance: 'FULL_COVERAGE',
            },
        } as any);
    });

    it('should switch between tabs', async () => {
        render(<Profile />);

        await waitFor(() => {
            fireEvent.click(screen.getByText('Historia wypożyczeń'));
            expect(screen.getByText('Twoje wypożyczenia')).toBeInTheDocument();
        });
    });

    it('should cancel edit mode', async () => {
        render(<Profile />);

        await waitFor(async () => {
            fireEvent.click(screen.getByText('Edytuj profil'));
            fireEvent.click(screen.getByText('Anuluj'));
            expect(screen.getByText('Edytuj profil')).toBeInTheDocument();
        });
    });

    it('should cancel a rental', async () => {
        const upcomingRental = {
            ...mockRentals[0],
            status: 'Nadchodzące',
        };
        vi.mocked(fetchCustomerRentals).mockResolvedValue([upcomingRental]);

        render(<Profile />);

        await waitFor(async () => {
            fireEvent.click(screen.getByText('Historia wypożyczeń'));
            fireEvent.click(screen.getByText('Anuluj'));

            expect(patchRental).toHaveBeenCalledWith('1', { status: 'Anulowane' });
        });
    });
});