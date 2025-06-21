import React from 'react';
import { render, screen, act } from '@testing-library/react';
import AboutUs from '../../../src/screens/AboutUs';

describe('AboutUs Component', () => {
    beforeEach(async () => {
        await act(async () => {
            render(<AboutUs />);
        });
    });

    it('renders the hero section with correct title and description', () => {
        expect(screen.getByText('O naszej wypożyczalni')).toBeInTheDocument();
        expect(screen.getByText(/Od 2010 roku dostarczamy najwyższej jakości samochody/)).toBeInTheDocument();
    });

    it('renders mission section with correct cards', () => {
        expect(screen.getByText('Nasza misja i wartości')).toBeInTheDocument();
        expect(screen.getByText('Jakość')).toBeInTheDocument();
        expect(screen.getByText(/Oferujemy tylko sprawdzone i zadbane samochody/)).toBeInTheDocument();
        expect(screen.getByText('Obsługa')).toBeInTheDocument();
        expect(screen.getByText(/Nasz zespół tworzą doświadczeni pracownicy/)).toBeInTheDocument();
        expect(screen.getByText('Innowacje')).toBeInTheDocument();
        expect(screen.getByText(/Stale rozwijamy naszą ofertę/)).toBeInTheDocument();
    });

    it('displays team section with correct members', () => {
        expect(screen.getByText('Nasz zespół')).toBeInTheDocument();
        expect(screen.getByText('Anna Kowalska')).toBeInTheDocument();
        expect(screen.getByText('Dyrektor Zarządzająca')).toBeInTheDocument();
        expect(screen.getByText(/Z branżą motoryzacyjną związana od 15 lat/)).toBeInTheDocument();
        expect(screen.getByText('Tomasz Nowak')).toBeInTheDocument();
        expect(screen.getByText('Kierownik Floty')).toBeInTheDocument();
        expect(screen.getByText(/Ekspert motoryzacyjny z pasją do samochodów/)).toBeInTheDocument();
        expect(screen.getByText('Marta Wiśniewska')).toBeInTheDocument();
        expect(screen.getByText('Kierownik Obsługi Klienta')).toBeInTheDocument();
        expect(screen.getByText(/Specjalistka w zakresie obsługi klienta/)).toBeInTheDocument();
    });

    it('renders company history timeline correctly', () => {
        expect(screen.getByText('Historia naszej firmy')).toBeInTheDocument();
        expect(screen.getByText('2010')).toBeInTheDocument();
        expect(screen.getByText('Rozpoczęcie działalności')).toBeInTheDocument();
        expect(screen.getByText(/Otwarcie pierwszego punktu wypożyczalni/)).toBeInTheDocument();
        expect(screen.getByText('2013')).toBeInTheDocument();
        expect(screen.getByText('Poszerzenie oferty')).toBeInTheDocument();
        expect(screen.getByText('2017')).toBeInTheDocument();
        expect(screen.getByText('Rozwój sieci')).toBeInTheDocument();
        expect(screen.getByText('2020')).toBeInTheDocument();
        expect(screen.getByText('Modernizacja floty')).toBeInTheDocument();
        expect(screen.getByText('2023')).toBeInTheDocument();
        expect(screen.getByText('Ekspansja i innowacje')).toBeInTheDocument();
    });

    it('shows correct contact information', () => {
        expect(screen.getByText('Skontaktuj się z nami')).toBeInTheDocument();
        expect(screen.getByText('Biuro główne')).toBeInTheDocument();
        expect(screen.getByText(/ul. Przykładowa 15, 00-001 Warszawa/)).toBeInTheDocument();
        expect(screen.getByText(/\+48 123 456 789/)).toBeInTheDocument();
        expect(screen.getByText(/kontakt@przykladowa-wypozyczalnia.pl/)).toBeInTheDocument();

        const hoursSection = screen.getByText('Godziny otwarcia').closest('.contact-card');
        expect(hoursSection).toHaveTextContent('Poniedziałek - Piątek');
        expect(hoursSection).toHaveTextContent('08:00 - 20:00');
        expect(hoursSection).toHaveTextContent('Sobota');
        expect(hoursSection).toHaveTextContent('09:00 - 16:00');
        expect(hoursSection).toHaveTextContent('Niedziela');
        expect(hoursSection).toHaveTextContent('10:00 - 14:00');
    });

    it('renders all section dividers', () => {
        const dividers = document.querySelectorAll('.ant-divider');
        expect(dividers.length).toBe(4);
    });
});