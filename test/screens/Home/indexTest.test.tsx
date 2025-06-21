import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import Home from '../../../src/screens/Home';
import { MemoryRouter } from 'react-router-dom';
import * as opinionsApi from '../../../src/api/opinions';
import * as carsApi from '../../../src/api/cars';
import type { Opinion, Car } from '../../../src/types';

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
];

describe('Home Screen', () => {
    beforeEach(() => {
        (opinionsApi.getAllOpinions as jest.Mock).mockResolvedValue(mockOpinions);
        (opinionsApi.getOpinionsByCarId as jest.Mock).mockResolvedValue(mockOpinions);
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
        });
    });
});