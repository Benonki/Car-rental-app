import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import Home from '../../../src/screens/Home';
import { MemoryRouter } from 'react-router-dom';
import * as opinionsApi from '../../../src/api/opinions';
import * as carsApi from '../../../src/api/cars';
import type { Opinion, Car } from '../../../src/types';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

vi.mock('../../../src/api/opinions', () => ({
    getAllOpinions: vi.fn(),
    getOpinionsByCarId: vi.fn(),
}));

vi.mock('../../../src/api/cars', () => ({
    getCars: vi.fn(),
}));

vi.mock('antd', async () => {
    const actual = await vi.importActual('antd');
    return {
        ...actual,
        Spin: () => <div>Loading...</div>,
    };
});

const mockOpinions: Opinion[] = [
    {
        id: '1',
        customer: {
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
                mileage: 10000,
            },
            cost: 500,
            deposit: 5000,
            availability: 'AVAILABLE',
            image_url: '/tesla.jpg',
            description: 'Luxury electric car',
        },
        rating: 5,
        description: 'Great car!',
        date_of_publishing: '2023-01-01',
    },
    {
        id: '2',
        customer: {
            id: '2',
            user: {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@example.com',
                provider: 'local',
                providerId: '2',
                enabled: true,
            },
            personalData: {
                id: '2',
                address: {
                    id: '2',
                    country: 'Poland',
                    postal_code: '00-002',
                    city: 'Krakow',
                    street: 'Second',
                    street_number: '2',
                },
                first_name: 'Jane',
                last_name: 'Smith',
                pesel: '98765432109',
                id_number: 'XYZ987654',
                phone_number: '987654321',
                email: 'jane@example.com',
            },
            date_of_joining: '2023-01-02',
            loyalty_points: 50,
        },
        car: {
            id: '2',
            model: {
                id: '2',
                name: 'Corolla',
                make: { id: '2', name: 'Toyota' },
                bodyType: { id: '2', name: 'Sedan' },
            },
            specification: {
                id: '2',
                yearOfProduction: 2021,
                registration: 'KR54321',
                vin: '98765432109876543',
                color: 'Blue',
                numberOfSeats: 5,
                engineCapacity: 1800,
                horsepower: 140,
                gearbox: 'Automatic',
                driveType: 'FWD',
                fuelType: 'Gasoline',
                mileage: 20000,
            },
            cost: 200,
            deposit: 3000,
            availability: 'AVAILABLE',
            image_url: '/toyota.jpg',
            description: 'Reliable car',
        },
        rating: 3,
        description: 'Average experience',
        date_of_publishing: '2023-01-02',
    },
];

const mockCars: Car[] = [
    {
        id: '1',
        nazwa: 'Tesla Model S',
        kategoria: 'Premium',
        cena: 500,
        image: '/tesla.jpg',
        ocena: 5,
        dostepny: true,
        opis: 'Luxury electric car',
    },
    {
        id: '2',
        nazwa: 'Toyota Corolla',
        kategoria: 'Standard',
        cena: 200,
        image: '/toyota.jpg',
        ocena: 4,
        dostepny: true,
        opis: 'Reliable car',
    },
    {
        id: '3',
        nazwa: 'Ford Focus',
        kategoria: 'Compact',
        cena: 150,
        image: '/ford.jpg',
        ocena: 3,
        dostepny: false,
        opis: 'Compact car',
    },
];

describe('Home Screen', () => {
    beforeEach(() => {
        (opinionsApi.getAllOpinions as jest.Mock).mockResolvedValue(mockOpinions);
        (opinionsApi.getOpinionsByCarId as jest.Mock).mockResolvedValue([mockOpinions[0]]);
        (carsApi.getCars as jest.Mock).mockResolvedValue(mockCars);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders the hero section correctly', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );
        });

        expect(screen.getByText('Wypożycz Swój Wymarzony Samochód')).toBeInTheDocument();
        expect(
            screen.getByText('Szeroki wybór pojazdów, konkurencyjne ceny i profesjonalna obsługa')
        ).toBeInTheDocument();
    });

    it('displays why us section correctly', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );
        });

        await waitFor(() => {
            expect(screen.getByText('Dlaczego warto wybrać naszą wypożyczalnię?')).toBeInTheDocument();
            expect(screen.getByText('Szeroki wybór pojazdów')).toBeInTheDocument();
            expect(screen.getByText('Elastyczne terminy')).toBeInTheDocument();
            expect(screen.getByText('Wiele lokalizacji')).toBeInTheDocument();
            expect(screen.getByText('Pełne ubezpieczenie')).toBeInTheDocument();
        });
    });

    it('displays testimonials section with filtered opinions', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );
        });

        await waitFor(() => {
            expect(screen.getByText('Co mówią nasi klienci')).toBeInTheDocument();
            expect(screen.getByText('"Great car!"')).toBeInTheDocument();
            expect(screen.getByText('- John')).toBeInTheDocument();
            expect(screen.queryByText('"Average experience"')).not.toBeInTheDocument();
        });
    });

    it('shows loading spinner while fetching data', async () => {
        (carsApi.getCars as jest.Mock).mockImplementation(() => new Promise(() => {}));

        await act(async () => {
            render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );
        });

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('displays popular cars section correctly', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );
        });

        await waitFor(() => {
            expect(screen.getByText('Popularne Samochody')).toBeInTheDocument();
            expect(screen.getByText('Tesla Model S')).toBeInTheDocument();
            expect(screen.getByText('Toyota Corolla')).toBeInTheDocument();
            expect(screen.getByText('Premium')).toBeInTheDocument();
            expect(screen.getByText('Standard')).toBeInTheDocument();
            expect(screen.getByText('500 zł')).toBeInTheDocument();
            expect(screen.getByText('200 zł')).toBeInTheDocument();
            expect(screen.getAllByText('Dostępny').length).toBe(2);
        });
    });

    it('opens opinion modal when "Zobacz opinie" button is clicked', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );
        });

        await waitFor(() => {
            const buttons = screen.getAllByText('Zobacz opinie');
            fireEvent.click(buttons[0]);
        });

        await waitFor(() => {
            expect(opinionsApi.getOpinionsByCarId).toHaveBeenCalledWith('1');
        });
    });

    it('handles API errors gracefully', async () => {
        console.error = vi.fn();
        (carsApi.getCars as jest.Mock).mockRejectedValue(new Error('API Error'));

        await act(async () => {
            render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );
        });

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith('Błąd przy ładowaniu popularnych aut:', expect.any(Error));
        });
    });

    it('filters opinions correctly (only ratings >= 4)', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );
        });

        await waitFor(() => {
            expect(screen.getByText('"Great car!"')).toBeInTheDocument();
            expect(screen.queryByText('"Average experience"')).not.toBeInTheDocument();
        });
    });
});