import { render, screen } from '@testing-library/react'
import FAQ from '../../../src/screens/FAQ'

describe('FAQ Screen', () => {
    test('renders FAQ component', () => {
        render(<FAQ />);
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    test('displays correct title', () => {
        render(<FAQ />);
        const title = screen.getByText('FAQ - Często zadawane pytania');
        expect(title).toBeInTheDocument();
    });

    test('renders all FAQ items', () => {
        render(<FAQ />);
        const questions = screen.getAllByRole('listitem');
        expect(questions.length).toBe(10);
    });

    test('displays correct first question and answer', () => {
        render(<FAQ />);
        const firstQuestion = screen.getByText('Jak mogę zarezerwować samochód?');
        const firstAnswer = screen.getByText(/Możesz dokonać rezerwacji online poprzez naszą stronę internetową/);

        expect(firstQuestion).toBeInTheDocument();
        expect(firstAnswer).toBeInTheDocument();
    });

    test('displays correct last question and answer', () => {
        render(<FAQ />);
        const lastQuestion = screen.getByText('Czy mogę wskazać dodatkowego kierowcę?');
        const lastAnswer = screen.getByText(/Tak, przy rezerwacji możesz dodać dodatkowego kierowcę./);

        expect(lastQuestion).toBeInTheDocument();
        expect(lastAnswer).toBeInTheDocument();
    });

    test('has ordered list structure', () => {
        render(<FAQ />);
        const orderedList = screen.getByRole('list');
        expect(orderedList).toBeInTheDocument();
        expect(orderedList.tagName).toBe('OL');
    });
});