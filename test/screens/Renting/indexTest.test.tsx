import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { message } from 'antd';
import Renting from '../../../src/screens/Renting';
import { getCarById } from '../../../src/api/cars';
import { createPayment, createRental } from '../../../src/api/rental';
import { createFullPickUpPlace, getPickUpPlaces, getReturnPlaces } from '../../../src/api/locations';
import { useUser } from '../../../src/contexts/UserContext';
import { Car, PickUpPlace, ReturnPlace } from "../../../src/types";

vi.mock('../../../src/api/cars');
vi.mock('../../../src/api/rental');
vi.mock('../../../src/api/insurance');
vi.mock('../../../src/api/locations');
vi.mock('../../../src/contexts/UserContext');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: vi.fn(),
    };
});

vi.mock('antd', async () => {
    const actual = await vi.importActual('antd');
    return {
        ...actual,
        message: {
            error: vi.fn(),
            success: vi.fn(),
        },
    };
});

describe('Renting Screen', () => {
    const mockCar: Car = {
        id: '1',
        nazwa: 'Test Car',
        kategoria: 'Premium',
        cena: 200,
        dostepny: true,
        opis: 'Test description',
        image: 'test.jpg',
        ocena: 4.5,
        specification: {
            yearOfProduction: 2022,
            registration: 'ABC123',
            vin: 'VIN123456789',
            color: 'Red',
            numberOfSeats: 5,
            engineCapacity: 2000,
            horsepower: 150,
            gearbox: 'Automatic',
            driveType: 'FWD',
            fuelType: 'Gasoline',
            mileage: 10000,
        },
    };

    const mockPickUpPlaces: PickUpPlace[] = [{
        id: '1',
        name: 'Pickup Place 1',
        address: {
            id: 'addr1',
            country: 'Poland',
            postal_code: '00-000',
            city: 'Warsaw',
            street: 'Test Street',
            street_number: '1'
        }
    }];

    const mockReturnPlaces: ReturnPlace[] = [{
        id: '1',
        name: 'Return Place 1',
        address: {
            id: 'addr1',
            country: 'Poland',
            postal_code: '00-000',
            city: 'Warsaw',
            street: 'Test Street',
            street_number: '1'
        }
    }];

    const mockRentalResponse = {
        id: 'rental1',
        car: {
            id: '1',
            model: {
                id: 'model1',
                name: 'Test Model',
                make: { id: 'make1', name: 'Test Make' },
                bodyType: { id: 'body1', name: 'Sedan' }
            },
            specification: {
                id: 'spec1',
                yearOfProduction: 2022,
                registration: 'ABC123',
                vin: 'VIN123456789',
                color: 'Red',
                numberOfSeats: 5,
                engineCapacity: 2000,
                horsepower: 150,
                gearbox: 'Automatic',
                driveType: 'FWD',
                fuelType: 'Gasoline',
                mileage: 10000
            },
            cost: 200,
            deposit: 1000,
            availability: 'AVAILABLE',
            image_url: 'test.jpg',
            description: 'Test description'
        },
        date_of_rental: '2023-01-01',
        date_of_return: '2023-01-07',
        total_cost: 1400,
        status: 'Zakończone'
    };

    const mockUserContext = {
        customerId: 'user1',
        username: 'testuser',
        setUsername: vi.fn(),
        setCustomerId: vi.fn(),
        logout: vi.fn(),
    };

    beforeEach(() => {
        vi.mocked(useParams).mockReturnValue({ id: '1' });
        vi.mocked(useUser).mockReturnValue(mockUserContext);
        vi.mocked(getCarById).mockResolvedValue(mockCar);
        vi.mocked(getPickUpPlaces).mockResolvedValue(mockPickUpPlaces);
        vi.mocked(getReturnPlaces).mockResolvedValue(mockReturnPlaces);
        vi.mocked(createRental).mockResolvedValue(mockRentalResponse);
        vi.mocked(createPayment).mockResolvedValue({ sessionUrl: 'https://stripe.com' });
        vi.mocked(createFullPickUpPlace).mockResolvedValue({
            id: '2',
            name: 'New Place',
            address: {
                id: 'addr2',
                country: 'Poland',
                postal_code: '00-001',
                city: 'Warsaw',
                street: 'New Street',
                street_number: '2'
            }
        });
    });

    const renderComponent = () => {
        return render(
            <MemoryRouter initialEntries={['/renting/1']}>
                <Routes>
                    <Route path="/renting/:id" element={<Renting />} />
                    <Route path="/cars" element={<div>Cars Page</div>} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('should render loading state initially', async () => {
        renderComponent();
        expect(screen.getByText('Ładowanie...')).toBeInTheDocument();
        await waitFor(() => expect(screen.queryByText('Ładowanie...')).not.toBeInTheDocument());
    });

    it('should display car details after loading', async () => {
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText('Test Car')).toBeInTheDocument();
            expect(screen.getByText('Premium')).toBeInTheDocument();
            expect(screen.getByText('200 zł')).toBeInTheDocument();
            expect(screen.getByText('Dostępny')).toBeInTheDocument();
        });
    });

    it('should show error message when car loading fails', async () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

        vi.mocked(getCarById).mockRejectedValue(new Error('Failed to load'));
        renderComponent();

        await waitFor(() =>
            expect(message.error).toHaveBeenCalledWith('Nie udało się załadować szczegółów samochodu')
        );

        consoleError.mockRestore();
    });


    it('should show new pickup place form when "Dodaj nowe miejsce" is clicked', async () => {
        renderComponent();
        await waitFor(() => screen.getByText('Test Car'));

        const pickupSelect = screen.getAllByText('Wybierz miejsce odbioru')[0];
        fireEvent.mouseDown(pickupSelect);

        const addButton = screen.getByText('+ Dodaj nowe miejsce');
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(screen.getByText('Dodaj nowe miejsce odbioru')).toBeInTheDocument();
        });
    });


    it('should add new pickup place when form is submitted', async () => {
        renderComponent();
        await waitFor(() => screen.getByText('Test Car'));

        const pickupSelect = screen.getAllByText('Wybierz miejsce odbioru')[0];
        fireEvent.mouseDown(pickupSelect);
        fireEvent.click(screen.getByText('+ Dodaj nowe miejsce'));

        const nameInput = screen.getByLabelText('Nazwa punktu');
        fireEvent.change(nameInput, { target: { value: 'New Place' } });

        const streetInput = screen.getByLabelText('Ulica');
        fireEvent.change(streetInput, { target: { value: 'New Street' } });

        const streetNumberInput = screen.getByLabelText('Numer budynku');
        fireEvent.change(streetNumberInput, { target: { value: '2' } });

        const cityInput = screen.getByLabelText('Miasto');
        fireEvent.change(cityInput, { target: { value: 'Warsaw' } });

        const postalCodeInput = screen.getByLabelText('Kod pocztowy');
        fireEvent.change(postalCodeInput, { target: { value: '00-001' } });

        const countryInput = screen.getByLabelText('Kraj');
        fireEvent.change(countryInput, { target: { value: 'Poland' } });

        const submitButton = screen.getByText('Zapisz');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(createFullPickUpPlace).toHaveBeenCalled();
            expect(message.success).toHaveBeenCalledWith('Miejsce odbioru dodane pomyślnie!');
        });
    });
});