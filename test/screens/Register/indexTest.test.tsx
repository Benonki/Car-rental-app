import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Register from '../../../src/screens/Register';
import { register } from '../../../src/api/auth';
import { MemoryRouter } from 'react-router-dom';
import { message } from 'antd';

vi.mock('../../../src/api/auth');
vi.mock('antd', async () => {
    const actual = await vi.importActual<typeof import('antd')>('antd');
    return {
        ...actual,
        message: {
            success: vi.fn(),
            error: vi.fn(),
        },
    };
});

describe('Register Screen', () => {
    const mockRegister = vi.mocked(register);
    const mockMessageError = vi.mocked(message.error);
    const mockMessageSuccess = vi.mocked(message.success);

    const renderRegister = () => {
        return render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );
    };

    const fillForm = async (fields: {
        email?: string;
        password?: string;
        terms?: boolean;
    }) => {
        if (fields.email !== undefined) {
            const emailInput = screen.getByLabelText('Email');
            await act(async () => {
                fireEvent.focus(emailInput);
                fireEvent.change(emailInput, { target: { value: fields.email } });
                fireEvent.blur(emailInput);
            });
            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 50));
            });
        }

        if (fields.password !== undefined) {
            const passwordInput = screen.getByLabelText('Hasło');
            await act(async () => {
                fireEvent.focus(passwordInput);
                fireEvent.change(passwordInput, { target: { value: fields.password } });
                fireEvent.blur(passwordInput);
            });
            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 50));
            });
        }

        if (fields.terms) {
            const termsCheckbox = screen.getByLabelText('Akceptuję warunki użytkowania');
            await act(async () => {
                fireEvent.click(termsCheckbox);
            });
        }
    };

    const submitForm = async () => {
        const submitButton = screen.getByText('Zarejestruj się');
        await act(async () => {
            fireEvent.click(submitButton);
        });
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
        });
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders all form elements', async () => {
        await act(async () => {
            renderRegister();
        });

        expect(screen.getByText('Register')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Hasło')).toBeInTheDocument();
        expect(screen.getByLabelText('Akceptuję warunki użytkowania')).toBeInTheDocument();
        expect(screen.getByText('Zarejestruj się')).toBeInTheDocument();
        expect(screen.getByText('Masz już konto?')).toBeInTheDocument();
    });

    it('shows email format validation error', async () => {
        await act(async () => {
            renderRegister();
        });

        await fillForm({ email: 'invalid-email' });

        await waitFor(() => {
            expect(screen.getByText('Podaj poprawny adres email!')).toBeInTheDocument();
        }, { timeout: 1000 });
    });

    it('shows password length validation error', async () => {
        await act(async () => {
            renderRegister();
        });

        await fillForm({ password: '123' });

        await waitFor(() => {
            expect(screen.getByText('Hasło musi mieć co najmniej 6 znaków!')).toBeInTheDocument();
        }, { timeout: 1000 });
    });

    it('successfully submits with valid data', async () => {
        mockRegister.mockResolvedValueOnce("User registered");
        await act(async () => {
            renderRegister();
        });

        await fillForm({
            email: 'test@example.com',
            password: 'validpassword',
            terms: true
        });
        await submitForm();

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'validpassword'
            });
        }, { timeout: 1000 });

        expect(mockMessageSuccess).toHaveBeenCalledWith('Rejestracja zakończona pomyślnie!');
    });

    it('handles API errors', async () => {
        const errorMessage = 'Email already in use';
        mockRegister.mockRejectedValueOnce({
            response: { data: { message: errorMessage } }
        });

        await act(async () => {
            renderRegister();
        });

        await fillForm({
            email: 'test@example.com',
            password: 'validpassword',
            terms: true
        });
        await submitForm();

        await waitFor(() => {
            expect(mockMessageError).toHaveBeenCalledWith(errorMessage);
        }, { timeout: 1000 });
    });
});