import '@testing-library/jest-dom/vitest';
import { afterEach, vi, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';

beforeAll(() => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    }));

    window.getComputedStyle = vi.fn().mockImplementation(() => ({
        getPropertyValue: () => '',
        display: '',
        appearance: '',
    }));

    Object.defineProperty(window, 'scrollTo', {
        value: vi.fn(),
        writable: true,
    });
});

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});