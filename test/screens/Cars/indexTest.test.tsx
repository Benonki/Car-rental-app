import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Cars from '../../../src/screens/Cars';
import { getCars } from '../../../src/api/cars';
import { getOpinionsByCarId } from '../../../src/api/opinions';
import type { Opinion } from '../../../src/types';

vi.mock('../../../src/api/cars', () => ({
    getCars: vi.fn(),
}));

vi.mock('../../../src/api/opinions', () => ({
    getOpinionsByCarId: vi.fn(),
}));

beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation((msg) => {
        if (
            typeof msg === 'string' &&
            msg.includes('[antd: Tabs] `Tabs.TabPane` is deprecated')
        ) {
            return;
        }
        console.log(msg);
    });
});

afterAll(() => {
    vi.restoreAllMocks();
});

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
        useLocation: vi.fn(),
    };
});

describe('Cars Screen', () => {
    const mockCars = [
        {
            id: '1',
            nazwa: 'Test Car 1',
            kategoria: 'sedan',
            cena: 200,
            image: 'image1.jpg',
            ocena: 4,
            dostepny: true,
            opis: 'Test description 1',
        },
        {
            id: '2',
            nazwa: 'Test Car 2',
            kategoria: 'suv',
            cena: 300,
            image: 'image2.jpg',
            ocena: 5,
            dostepny: false,
            opis: 'Test description 2',
        },
    ];

    const mockOpinions: Opinion[] = [
        {
            id: '1',
            customer: {
                id: '1',
                user: {
                    id: '1',
                    name: 'User1',
                    email: 'user1@test.com',
                    provider: 'local',
                    providerId: '1',
                    enabled: true
                },
                personalData: {
                    id: '1',
                    address: {
                        id: '1',
                        country: 'Poland',
                        postal_code: '00-001',
                        city: 'Warsaw',
                        street: 'Test',
                        street_number: '1'
                    },
                    first_name: 'John',
                    last_name: 'Doe',
                    pesel: '12345678901',
                    id_number: 'ABC123456',
                    phone_number: '123456789',
                    email: 'user1@test.com'
                },
                date_of_joining: '2023-01-01',
                loyalty_points: 0
            },
            car: {
                id: '1',
                model: {
                    id: '1',
                    name: 'Test Model',
                    make: {
                        id: '1',
                        name: 'Test Make'
                    },
                    bodyType: {
                        id: '1',
                        name: 'Sedan'
                    }
                },
                specification: {
                    id: '1',
                    yearOfProduction: 2020,
                    registration: 'WA12345',
                    vin: '12345678901234567',
                    color: 'Red',
                    numberOfSeats: 5,
                    engineCapacity: 2000,
                    horsepower: 150,
                    gearbox: 'Automatic',
                    driveType: 'FWD',
                    fuelType: 'Gasoline',
                    mileage: 50000
                },
                cost: 200,
                deposit: 1000,
                availability: 'AVAILABLE',
                image_url: 'image1.jpg',
                description: 'Test car'
            },
            rating: 4,
            description: 'Great car!',
            date_of_publishing: '2023-01-01',
        },
    ];

    beforeEach(() => {
        vi.mocked(useLocation).mockReturnValue({
            search: '',
            state: null,
            key: '',
            pathname: '',
            hash: '',
        });

        vi.mocked(useNavigate).mockReturnValue(vi.fn());
        vi.mocked(getCars).mockResolvedValue(mockCars);
        vi.mocked(getOpinionsByCarId).mockResolvedValue(mockOpinions);
    });

    it('should render loading state initially', async () => {
        render(
            <MemoryRouter>
                <Cars />
            </MemoryRouter>
        );

        expect(screen.getByText(/Nasza Flota Samochodów/i)).toBeInTheDocument();
        await waitFor(() => expect(getCars).toHaveBeenCalled());
    });

    it('should display all cars when no category filter is applied', async () => {
        render(
            <MemoryRouter>
                <Cars />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Test Car 1')).toBeInTheDocument();
            expect(screen.getByText('Test Car 2')).toBeInTheDocument();
        });
    });

    it('should filter cars by category when tab is clicked', async () => {
        vi.mocked(useLocation).mockReturnValue({
            search: '?type=sedan',
            state: null,
            key: '',
            pathname: '',
            hash: '',
        });

        render(
            <MemoryRouter>
                <Cars />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Test Car 1')).toBeInTheDocument();
            expect(screen.queryByText('Test Car 2')).not.toBeInTheDocument();
        });
    });

    it('should show "No cars" message when no cars match the filter', async () => {
        vi.mocked(useLocation).mockReturnValue({
            search: '?type=coupe',
            state: null,
            key: '',
            pathname: '',
            hash: '',
        });

        render(
            <MemoryRouter>
                <Cars />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Brak dostępnych samochodów w wybranej kategorii/i)).toBeInTheDocument();
        });
    });

    it('should open opinion modal when "Zobacz opinie" button is clicked', async () => {
        render(
            <MemoryRouter>
                <Cars />
            </MemoryRouter>
        );

        await waitFor(() => {
            const buttons = screen.getAllByText('Zobacz opinie');
            fireEvent.click(buttons[0]);
        });

        await waitFor(() => {
            expect(getOpinionsByCarId).toHaveBeenCalledWith('1');
            expect(screen.getByText('Great car!')).toBeInTheDocument();
        });
    });

    it('should navigate to renting page when "Zarezerwuj" button is clicked', async () => {
        const mockNavigate = vi.fn();
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);

        render(
            <MemoryRouter>
                <Cars />
            </MemoryRouter>
        );

        await waitFor(() => {
            const buttons = screen.getAllByRole('button', { name: /Zarezerwuj/i });
            fireEvent.click(buttons[0]);
            expect(mockNavigate).toHaveBeenCalledWith('/renting/1');
        });
    });
});