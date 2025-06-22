import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter, useNavigate, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import Login from '../../../src/screens/Login';
import { login } from '../../../src/api/auth';
import { useUser } from '../../../src/contexts/UserContext';

vi.mock('../../../src/api/auth');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
        useSearchParams: vi.fn(),
    };
});
vi.mock('../../../src/contexts/UserContext');
vi.mock('js-cookie');
vi.mock('antd', async () => {
    const actual = await vi.importActual('antd');
    return {
        ...actual,
        message: {
            success: vi.fn(),
            error: vi.fn(),
        },
    };
});

describe('Login Screen', () => {
    const mockLogin = vi.mocked(login);
    const mockUseNavigate = vi.mocked(useNavigate);
    const mockUseSearchParams = vi.mocked(useSearchParams);
    const mockUseUser = vi.mocked(useUser);
    const mockMessageSuccess = vi.mocked(message.success);
    const mockMessageError = vi.mocked(message.error);

    const mockNavigate = vi.fn();
    const mockSetUsername = vi.fn();
    const mockSetCustomerId = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseNavigate.mockReturnValue(mockNavigate);
        mockUseUser.mockReturnValue({
            setUsername: mockSetUsername,
            setCustomerId: mockSetCustomerId,
            username: null,
            customerId: null,
            logout: vi.fn(),
        });
        mockUseSearchParams.mockReturnValue([new URLSearchParams(), vi.fn()]);
    });

    const renderLogin = () => {
        return render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
    };

    const fillAndSubmitForm = async (email: string, password: string) => {
        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByText('Zaloguj się');

        await act(async () => {
            fireEvent.change(emailInput, { target: { value: email } });
            fireEvent.change(passwordInput, { target: { value: password } });
            fireEvent.click(submitButton);
        });
    };

    it('renders all form elements', () => {
        renderLogin();

        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByText('Zaloguj się')).toBeInTheDocument();
        expect(screen.getByText('Zaloguj przez Google')).toBeInTheDocument();
        expect(screen.getByText('Pierwszy raz?')).toBeInTheDocument();
        expect(screen.getByText('Zarejestruj się')).toBeInTheDocument();
    });

    it('successfully logs in with valid credentials', async () => {
        mockLogin.mockResolvedValueOnce({
            message: 'Success',
            customerId: '123'
        });
        renderLogin();

        const testEmail = 'test@example.com';
        const testPassword = 'password123';

        await fillAndSubmitForm(testEmail, testPassword);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                email: testEmail,
                password: testPassword
            });
            expect(mockSetUsername).toHaveBeenCalledWith(testEmail);
            expect(mockSetCustomerId).toHaveBeenCalledWith('123');
            expect(mockMessageSuccess).toHaveBeenCalledWith('Zalogowano pomyślnie!');
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    it('shows error message when login fails', async () => {
        mockLogin.mockResolvedValueOnce({
            message: 'Invalid credentials'
        });
        renderLogin();

        await fillAndSubmitForm('wrong@example.com', 'wrongpassword');

        await waitFor(() => {
            expect(mockMessageError).toHaveBeenCalledWith('Invalid credentials');
        });
    });


    it('handles Google OAuth callback error', async () => {
        const mockSearchParams = new URLSearchParams();
        mockSearchParams.set('token', 'invalid-token');
        mockSearchParams.set('refreshToken', 'invalid-refresh-token');
        mockUseSearchParams.mockReturnValue([mockSearchParams, vi.fn()]);

        vi.spyOn(console, 'log').mockImplementation(() => {});
        vi.useFakeTimers();

        renderLogin();

        await act(async () => {
            vi.advanceTimersByTime(200);
        });

        expect(mockMessageError).toHaveBeenCalledWith('Błąd podczas logowania przez Google');
        expect(mockNavigate).toHaveBeenCalledWith('/login');

        vi.useRealTimers();
    });

    it('navigates to register page when clicking register link', () => {
        renderLogin();
        const registerLink = screen.getByText('Zarejestruj się');

        expect(registerLink).toHaveAttribute('href', '/register');
    });
});