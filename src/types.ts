export type LoginData = {
    username: string
    password: string
}

export type Car = {
    id: number;
    nazwa: string;
    kategoria: string;
    cena: number;
    image: string;
    ocena: number;
    dostepny: boolean;
    opis: string;
}