import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CarOpinionModal from '../../src/components/CarOpinionModal';
import type { Opinion } from '../../src/types';

describe('CarOpinionModal', () => {
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
                    make: {
                        id: '1',
                        name: 'Tesla',
                    },
                    bodyType: {
                        id: '1',
                        name: 'Sedan',
                    },
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
                image_url: 'tesla.jpg',
                description: 'Electric car',
            },
            rating: 5,
            description: 'Excellent car!',
            date_of_publishing: '2023-05-15',
        },
    ];

    const mockOnClose = vi.fn();

    it('should not render when visible is false', () => {
        render(
            <CarOpinionModal
                visible={false}
                carName="Tesla Model S"
                opinions={mockOpinions}
                onClose={mockOnClose}
            />
        );

        expect(screen.queryByText('Opinie o samochodzie: Tesla Model S')).not.toBeInTheDocument();
    });

    it('should display "No opinions" message when opinions array is empty', () => {
        render(
            <CarOpinionModal
                visible={true}
                carName="Tesla Model S"
                opinions={[]}
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText('Opinie o samochodzie: Tesla Model S')).toBeInTheDocument();
        expect(screen.getByText('Brak opinii dla tego samochodu.')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', async () => {
        render(
            <CarOpinionModal
                visible={true}
                carName="Tesla Model S"
                opinions={mockOpinions}
                onClose={mockOnClose}
            />
        );

        const closeButton = screen.getByRole('button', { name: /close/i });
        await userEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledOnce();
    });
});