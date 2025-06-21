import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { axiosInstance } from '../../src/api/instance';
import { login, register, logout, refreshAuthToken, decodeJwt }  from '../../src/api/auth';
import Cookies from 'js-cookie';

vi.mock('../../src/api/instance', () => ({
    axiosInstance: {
        post: vi.fn(() => Promise.resolve({ data: {} }))
    }
}))
vi.mock('js-cookie', () => ({
    default: {
        get: vi.fn(),
        set: vi.fn(),
        remove: vi.fn()
    }
}))

describe('auth module', () => {
    const mockToken = 'mock-auth-token'
    const mockRefreshToken = 'mock-refresh-token'
    const mockResponse = {
        data: {
            token: mockToken,
            refreshToken: mockRefreshToken
        }
    }

    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(axiosInstance.post).mockReset()
    })

    describe('login', () => {
        it('should set cookies and return data on successful login', async () => {
            const loginData = { email: 'test@example.com', password: 'password' }
            vi.mocked(axiosInstance.post).mockResolvedValue(mockResponse)

            const result = await login(loginData)

            expect(axiosInstance.post).toHaveBeenCalledWith('auth/login', loginData)
            expect(Cookies.set).toHaveBeenCalledWith('authToken', mockToken, { expires: 1 })
            expect(Cookies.set).toHaveBeenCalledWith('refreshToken', mockRefreshToken, { expires: 7 })
            expect(result).toEqual(mockResponse.data)
        })

        it('should not set cookies if no token in response', async () => {
            const loginData = { email: 'test@example.com', password: 'password' }
            vi.mocked(axiosInstance.post).mockResolvedValue({ data: {} })

            const result = await login(loginData)

            expect(axiosInstance.post).toHaveBeenCalledWith('auth/login', loginData)
            expect(Cookies.set).not.toHaveBeenCalled()
            expect(result).toEqual({})
        })
    })

    describe('register', () => {
        it('should register user with correct data', async () => {
            const registerData = { email: 'test@example.com', password: 'password' }
            const expectedRequestData = {
                email: 'test@example.com',
                password: 'password',
                role: 'ROLE_USER'
            }
            vi.mocked(axiosInstance.post).mockResolvedValue({ data: { success: true } })

            await register(registerData)

            expect(axiosInstance.post).toHaveBeenCalledWith(
                'auth/register',
                expectedRequestData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
        })
    })

    describe('logout', () => {
        it('should remove cookies and return true on successful logout', async () => {
            vi.mocked(axiosInstance.post).mockResolvedValue({})

            const result = await logout()

            expect(axiosInstance.post).toHaveBeenCalledWith('auth/logout')
            expect(Cookies.remove).toHaveBeenCalledWith('authToken')
            expect(Cookies.remove).toHaveBeenCalledWith('refreshToken')
            expect(result).toBe(true)
        })

        it('should return false and log error on logout failure', async () => {
            const error = new Error('Logout failed')
            vi.mocked(axiosInstance.post).mockRejectedValue(error)
            vi.spyOn(console, 'error').mockImplementation(() => {})

            const result = await logout()

            expect(result).toBe(false)
            expect(console.error).toHaveBeenCalledWith('Logout failed:', error)
        })
    })

    describe('refreshAuthToken', () => {
        const mockRefreshToken = 'mock-refresh-token';

        beforeEach(() => {
            vi.clearAllMocks();
            (Cookies.get as Mock).mockImplementation(
                (key?: string) => (key === 'refreshToken' ? mockRefreshToken : undefined)
            );
        });

        it('should refresh token successfully', async () => {
            const newToken = 'new-auth-token';
            vi.mocked(axiosInstance.post).mockResolvedValue({
                data: { authToken: newToken }
            });

            const result = await refreshAuthToken();

            expect(Cookies.get).toHaveBeenCalledWith('refreshToken');
            expect(axiosInstance.post).toHaveBeenCalledWith('auth/refreshToken', {
                refreshToken: mockRefreshToken
            });
            expect(Cookies.set).toHaveBeenCalledWith('authToken', newToken, { expires: 1 });
            expect(result).toBe(newToken);
        });

        it('should throw error when no refresh token available', async () => {
            (Cookies.get as unknown as Mock<(key: string) => string | undefined>).mockReturnValue(undefined)

            await expect(refreshAuthToken()).rejects.toThrow('No refresh token available');
        });

        it('should throw error when token refresh fails', async () => {
            vi.mocked(axiosInstance.post).mockResolvedValue({ data: {} });
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await expect(refreshAuthToken()).rejects.toThrow('Failed to refresh token');
            expect(consoleErrorSpy).toHaveBeenCalledWith('Token refresh failed:', expect.any(Error));

            consoleErrorSpy.mockRestore();
        });

        it('should throw error when API call fails', async () => {
            const error = new Error('API error');
            vi.mocked(axiosInstance.post).mockRejectedValue(error);
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await expect(refreshAuthToken()).rejects.toThrow(error);
            expect(consoleErrorSpy).toHaveBeenCalledWith('Token refresh failed:', error);

            consoleErrorSpy.mockRestore();
        });
    });

    describe('decodeJwt', () => {
        it('should decode valid JWT', () => {
            const payload = { sub: '123', exp: 1234567890, iat: 1234567800, roles: ['ROLE_USER'] }
            const base64Payload = btoa(JSON.stringify(payload))
            const token = `header.${base64Payload}.signature`

            const result = decodeJwt(token)

            expect(result).toEqual(payload)
        })

        it('should return null for invalid JWT format', () => {
            vi.spyOn(console, 'error').mockImplementation(() => {})
            const result = decodeJwt('invalid-token')
            expect(result).toBeNull()
            expect(console.error).toHaveBeenCalledWith('Error decoding JWT:', expect.any(Error))
        })

        it('should return null for malformed JWT', () => {
            vi.spyOn(console, 'error').mockImplementation(() => {})
            const result = decodeJwt('header..signature')
            expect(result).toBeNull()
            expect(console.error).toHaveBeenCalledWith('Error decoding JWT:', expect.any(Error))
        })
    })
})