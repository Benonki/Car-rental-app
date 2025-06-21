import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResultPage from '../../../src/screens/ResultPage';
import { updateRentalStatus } from '../../../src/api/rental';
import { ResultPageState } from '../../../src/types';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual as object,
        useLocation: vi.fn(),
        useNavigate: vi.fn(() => vi.fn()),
    };
});

vi.mock('../../../src/api/rental', () => ({
    updateRentalStatus: vi.fn(),
}));

describe('ResultPage Screen', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should display success message when state.success=true', () => {
        const mockState: ResultPageState = {
            success: true,
            message: 'Płatność zakończona sukcesem',
            rentalStatus: 'Nadchodzące'
        };

        vi.mocked(useLocation).mockReturnValue({
            state: mockState,
            key: '',
            pathname: '',
            search: '',
            hash: ''
        });

        render(
            <MemoryRouter>
                <ResultPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Płatność zakończona sukcesem')).toBeInTheDocument();
        expect(screen.getByText('Status wypożyczenia: Nadchodzące')).toBeInTheDocument();
    });

    it('should display error message when state.success=false', () => {
        const mockState: ResultPageState = {
            success: false,
            message: 'Płatność nie powiodła się',
            rentalStatus: 'Anulowane'
        };

        vi.mocked(useLocation).mockReturnValue({
            state: mockState,
            key: '',
            pathname: '',
            search: '',
            hash: ''
        });

        render(
            <MemoryRouter>
                <ResultPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Płatność nie powiodła się')).toBeInTheDocument();
        expect(screen.getByText('Status wypożyczenia: Anulowane')).toBeInTheDocument();
    });

    it('should update status to Cancelled and clear localStorage when success=false', async () => {
        const rentalId = '123';
        localStorage.setItem('pendingRental', JSON.stringify({ rentalId }));

        const mockState: ResultPageState = {
            success: false,
            message: 'Błąd',
            rentalStatus: 'Anulowane'
        };

        vi.mocked(useLocation).mockReturnValue({
            state: mockState,
            key: '',
            pathname: '',
            search: '',
            hash: ''
        });

        render(
            <MemoryRouter>
                <ResultPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(updateRentalStatus).toHaveBeenCalledWith(rentalId, 'Anulowane');
            expect(localStorage.getItem('pendingRental')).toBeNull();
        });
    });

    it('should display return to homepage button', () => {
        const mockState: ResultPageState = {
            success: true,
            message: 'Test',
            rentalStatus: 'Nadchodzące'
        };

        vi.mocked(useLocation).mockReturnValue({
            state: mockState,
            key: '',
            pathname: '',
            search: '',
            hash: ''
        });

        render(
            <MemoryRouter>
                <ResultPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Powrót do strony głównej')).toBeInTheDocument();
    });
});