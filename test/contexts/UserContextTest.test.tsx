import { renderHook, act } from '@testing-library/react';
import { UserProvider, useUser } from '../../src/contexts/UserContext';
import { ReactNode } from 'react';

describe('UserContext', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
        <UserProvider>{children}</UserProvider>
    );

    it('should provide initial values', () => {
        const { result } = renderHook(() => useUser(), { wrapper });

        expect(result.current.username).toBeNull();
        expect(result.current.customerId).toBeNull();
    });

    it('should set and get username', () => {
        const { result } = renderHook(() => useUser(), { wrapper });

        act(() => {
            result.current.setUsername('testUser');
        });

        expect(result.current.username).toBe('testUser');
        expect(localStorage.getItem('username')).toBe('testUser');
    });

    it('should set and get customerId', () => {
        const { result } = renderHook(() => useUser(), { wrapper });

        act(() => {
            result.current.setCustomerId('cust123');
        });

        expect(result.current.customerId).toBe('cust123');
        expect(localStorage.getItem('customerId')).toBe('cust123');
    });

    it('should remove username when set to null', () => {
        const { result } = renderHook(() => useUser(), { wrapper });

        act(() => {
            result.current.setUsername('testUser');
        });

        expect(result.current.username).toBe('testUser');

        act(() => {
            result.current.setUsername(null);
        });

        expect(result.current.username).toBeNull();
        expect(localStorage.getItem('username')).toBeNull();
    });

    it('should remove customerId when set to null', () => {
        const { result } = renderHook(() => useUser(), { wrapper });

        act(() => {
            result.current.setCustomerId('cust123');
        });

        expect(result.current.customerId).toBe('cust123');

        act(() => {
            result.current.setCustomerId(null);
        });

        expect(result.current.customerId).toBeNull();
        expect(localStorage.getItem('customerId')).toBeNull();
    });

    it('should logout and clear all data', () => {
        const { result } = renderHook(() => useUser(), { wrapper });

        act(() => {
            result.current.setUsername('testUser');
            result.current.setCustomerId('cust123');
        });

        expect(result.current.username).toBe('testUser');
        expect(result.current.customerId).toBe('cust123');

        act(() => {
            result.current.logout();
        });

        expect(result.current.username).toBeNull();
        expect(result.current.customerId).toBeNull();
        expect(localStorage.getItem('username')).toBeNull();
        expect(localStorage.getItem('customerId')).toBeNull();
    });

    it('should load data from localStorage on mount', () => {
        localStorage.setItem('username', 'savedUser');
        localStorage.setItem('customerId', 'savedCust123');

        const { result } = renderHook(() => useUser(), { wrapper });

        expect(result.current.username).toBe('savedUser');
        expect(result.current.customerId).toBe('savedCust123');
    });

    it('should throw error when useUser is used without UserProvider', () => {
        let error: Error | undefined;

        try {
            renderHook(() => useUser());
        } catch (e) {
            error = e as Error;
        }

        expect(error).toBeDefined();
        expect(error?.message).toBe('useUser must be used within a UserProvider');
    });
});