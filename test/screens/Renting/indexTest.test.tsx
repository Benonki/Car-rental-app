import {render, screen, waitFor, fireEvent, act} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { message } from 'antd';
import Renting from '../../../src/screens/Renting';
import { getCarById } from '../../../src/api/cars';
import { createPayment, createRental } from '../../../src/api/rental';
import { createInsurance } from '../../../src/api/insurance';
import { createFullPickUpPlace, createFullReturnPlace, getPickUpPlaces, getReturnPlaces } from '../../../src/api/locations';
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
        vi.mocked(createInsurance).mockResolvedValue({ id: 'ins1' });
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
        vi.mocked(createFullReturnPlace).mockResolvedValue({
            id: '2',
            name: 'New Return Place',
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


    it('should add new return place when form is submitted', async () => {
        renderComponent();
        await waitFor(() => screen.getByText('Test Car'));

        const returnSelect = screen.getAllByText('Wybierz miejsce zwrotu')[0];
        fireEvent.mouseDown(returnSelect);
        fireEvent.click(screen.getByText('+ Dodaj nowe miejsce'));

        const nameInput = screen.getByLabelText('Nazwa punktu');
        fireEvent.change(nameInput, { target: { value: 'New Return Place' } });

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
            expect(createFullReturnPlace).toHaveBeenCalled();
            expect(message.success).toHaveBeenCalledWith('Miejsce zwrotu dodane pomyślnie!');
        });
    });

    it('should disable payment buttons when car is not available', async () => {
        vi.mocked(getCarById).mockResolvedValueOnce({
            ...mockCar,
            dostepny: false
        });

        renderComponent();
        await waitFor(() => screen.getByText('Niedostępny'));

        const onSiteButton = screen.getByRole('button', { name: /Zapłać przy odbiorze/i });
        const stripeButton = screen.getByRole('button', { name: /Zapłać przez Stripe/i });

        expect(onSiteButton).toBeDisabled();
        expect(stripeButton).toBeDisabled();
    });

    it('should disable payment buttons when no dates are selected', async () => {
        renderComponent();
        await waitFor(() => screen.getByText('Test Car'));

        const onSiteButton = screen.getByRole('button', { name: /Zapłać przy odbiorze/i });
        const stripeButton = screen.getByRole('button', { name: /Zapłać przez Stripe/i });

        expect(onSiteButton).toBeDisabled();
        expect(stripeButton).toBeDisabled();
    });

    it('should calculate total cost correctly without insurance', async () => {
        renderComponent();
        await waitFor(() => screen.getByText('Test Car'));

        const datePickers = screen.getAllByLabelText('Okres Wypożyczenia');
        await act(async () => {
            fireEvent.mouseDown(datePickers[0]);
            fireEvent.change(datePickers[0], { target: { value: '2023-01-01,2023-01-03' } });
        });

        await waitFor(() => {
            expect(screen.getByText(/Suma:/)).toBeInTheDocument();
        });
    });

    it('should close pickup place drawer on cancel', async () => {
        renderComponent();
        await waitFor(() => screen.getByText('Test Car'));

        const pickupSelect = screen.getAllByText('Wybierz miejsce odbioru')[0];
        fireEvent.mouseDown(pickupSelect);
        fireEvent.click(screen.getByText('+ Dodaj nowe miejsce'));

        expect(screen.getByText('Dodaj nowe miejsce odbioru')).toBeInTheDocument();

        const cancelButton = screen.getByText('Anuluj');
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByText('Dodaj nowe miejsce odbioru')).not.toBeInTheDocument();
        });
    });

    it('should close return place drawer on cancel', async () => {
        renderComponent();
        await waitFor(() => screen.getByText('Test Car'));

        const returnSelect = screen.getAllByText('Wybierz miejsce zwrotu')[0];
        fireEvent.mouseDown(returnSelect);
        fireEvent.click(screen.getByText('+ Dodaj nowe miejsce'));

        expect(screen.getByText('Dodaj nowe miejsce zwrotu')).toBeInTheDocument();

        const cancelButton = screen.getByText('Anuluj');
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByText('Dodaj nowe miejsce zwrotu')).not.toBeInTheDocument();
        });
    });

    it('should filter return places by search input', async () => {
        renderComponent();
        await waitFor(() => screen.getByText('Test Car'));

        const returnSelect = screen.getAllByText('Wybierz miejsce zwrotu')[0];
        fireEvent.mouseDown(returnSelect);

        const input = screen.getAllByRole('combobox')[1];
        fireEvent.change(input, {target: {value: 'Return'}});

        await waitFor(() => {
            expect(screen.getByText('Return Place 1 - Warsaw')).toBeInTheDocument();
        });
    });

    it('should not show cost breakdown when no dates are selected', async () => {
        renderComponent();
        await waitFor(() => screen.getByText('Test Car'));

        expect(screen.getByText('Suma: 0 zł')).toBeInTheDocument();
        expect(screen.queryByText('dni × 200 zł/dzień')).not.toBeInTheDocument();
    });

    it('should handle missing customerId', async () => {
        vi.mocked(useUser).mockReturnValue({
            ...mockUserContext,
            customerId: null
        });

        renderComponent();
        await waitFor(() => screen.getByText('Test Car'));

        const datePickers = screen.getAllByLabelText('Okres Wypożyczenia');
        await act(async () => {
            fireEvent.change(datePickers[0], {target: {value: '2023-01-01,2023-01-07'}});
        });

        const onSiteButton = screen.getByRole('button', {name: /Zapłać przy odbiorze/i});
        fireEvent.click(onSiteButton);

        expect(createRental).not.toHaveBeenCalled();
    });

    it('should display technical specifications correctly', async () => {
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText('2022')).toBeInTheDocument();
            expect(screen.getByText('ABC123')).toBeInTheDocument();
            expect(screen.getByText('VIN123456789')).toBeInTheDocument();
            expect(screen.getByText('Red')).toBeInTheDocument();
            expect(screen.getByText('5')).toBeInTheDocument();
            expect(screen.getByText('2000 cm³')).toBeInTheDocument();
            expect(screen.getByText('150 KM')).toBeInTheDocument();
            expect(screen.getByText('Automatic')).toBeInTheDocument();
            expect(screen.getByText('FWD')).toBeInTheDocument();
            expect(screen.getByText('Gasoline')).toBeInTheDocument();
            expect(screen.getByText('10000 km')).toBeInTheDocument();
        });
    });

});