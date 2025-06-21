import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import LayoutApp from '../src/layout';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useLocation: vi.fn(),
        Outlet: () => <div>Outlet Content</div>,
    };
});

vi.mock('../src/api/auth', () => ({
    logout: vi.fn().mockResolvedValue({}),
}));

const mockLogout = vi.fn();

vi.mock('../src/contexts/UserContext', () => ({
    useUser: vi.fn(() => ({
        username: 'testuser',
        logout: mockLogout,
    })),
}));

describe('LayoutApp', () => {
    beforeEach(() => {
        vi.mocked(useLocation).mockReturnValue({
            pathname: '/',
            search: '',
            hash: '',
            state: null,
            key: 'default',
        });
    });

    it('renders correctly', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <LayoutApp />
                </MemoryRouter>
            );
        });

        expect(screen.getByAltText('Logo')).toBeInTheDocument();
        expect(screen.getAllByText('Nasze Auta')[0]).toBeInTheDocument();
        expect(screen.getAllByText('O Nas')[0]).toBeInTheDocument();
        expect(screen.getAllByText('FAQ')[0]).toBeInTheDocument();
        expect(screen.getByText('Wyloguj się')).toBeInTheDocument();
        expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    it('toggles mobile menu', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <LayoutApp />
                </MemoryRouter>
            );
        });

        const menuButton = screen.getByLabelText('Otwórz menu');

        await act(async () => {
            fireEvent.click(menuButton);
        });

        await waitFor(() => {
            expect(document.querySelector('.layout-sider.mobile-open')).toBeInTheDocument();
        });

        await act(async () => {
            fireEvent.click(menuButton);
        });

        await waitFor(() => {
            expect(document.querySelector('.layout-sider.mobile-open')).not.toBeInTheDocument();
        });
    });

    it('closes mobile menu when clicking overlay', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <LayoutApp />
                </MemoryRouter>
            );
        });

        await act(async () => {
            fireEvent.click(screen.getByLabelText('Otwórz menu'));
        });

        const overlay = document.querySelector('.mobile-sider-overlay');
        if (overlay) {
            await act(async () => {
                fireEvent.click(overlay);
            });
        }

        await waitFor(() => {
            expect(document.querySelector('.layout-sider.mobile-open')).not.toBeInTheDocument();
        });
    });

    it('handles main menu clicks', async () => {
        const originalLocation = window.location;

        Object.defineProperty(window, 'location', {
            value: {
                ...originalLocation,
                href: ''
            },
            writable: true
        });

        await act(async () => {
            render(
                <MemoryRouter>
                    <LayoutApp />
                </MemoryRouter>
            );
        });

        await act(async () => {
            fireEvent.click(screen.getAllByText('Strona Główna')[0]);
        });
        expect(window.location.href).toBe('/');

        await act(async () => {
            fireEvent.click(screen.getAllByText('Nasze Auta')[0]);
        });
        expect(window.location.href).toBe('/cars');

        await act(async () => {
            fireEvent.click(screen.getAllByText('O Nas')[0]);
        });
        expect(window.location.href).toBe('/about');

        await act(async () => {
            fireEvent.click(screen.getAllByText('FAQ')[0]);
        });
        expect(window.location.href).toBe('/FAQ');

        Object.defineProperty(window, 'location', {
            value: originalLocation,
            writable: true
        });
    });

    it('handles logout', async () => {
        const { logout } = await import('../src/api/auth');
        const originalLocation = window.location;

        Object.defineProperty(window, 'location', {
            value: {
                ...originalLocation,
                href: ''
            },
            writable: true
        });

        await act(async () => {
            render(
                <MemoryRouter>
                    <LayoutApp />
                </MemoryRouter>
            );
        });

        await act(async () => {
            fireEvent.click(screen.getByText('Wyloguj się'));
        });

        await waitFor(() => {
            expect(logout).toHaveBeenCalled();
            expect(mockLogout).toHaveBeenCalled();
            expect(window.location.href).toBe('/login');
        });

        Object.defineProperty(window, 'location', {
            value: originalLocation,
            writable: true
        });
    });

    it('displays footer content correctly', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <LayoutApp />
                </MemoryRouter>
            );
        });

        expect(screen.getByText(/CarRental App. Wszelkie prawa zastrzeżone./i)).toBeInTheDocument();
        expect(screen.getByText('ul. Przykładowa 15, 00-001 Warszawa')).toBeInTheDocument();
        expect(screen.getByText('+48 123 456 789')).toBeInTheDocument();
        expect(screen.getByText('kontakt@przykladowa-wypozyczalnia.pl')).toBeInTheDocument();
        expect(screen.getByText('Pon – Pt: 08:00 – 18:00')).toBeInTheDocument();
    });
});