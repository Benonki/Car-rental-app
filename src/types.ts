export type LoginData = {
    email: string
    password: string
}

export type Car = {
    id: string;
    nazwa: string;
    kategoria: string;
    cena: number;
    image: string;
    ocena: number;
    dostepny: boolean;
    opis: string;
};

export type RawCar = {
    id: string;
    model: {
        id: string;
        name: string;
        make: {
            id: string;
            name: string;
        };
        bodyType: {
            id: string;
            name: string;
        };
    };
    specification: {
        id: string;
        yearOfProduction: number;
        registration: string;
        vin: string;
        color: string;
        numberOfSeats: number;
        engineCapacity: number;
        horsepower: number;
        gearbox: string;
        driveType: string;
        fuelType: string;
        mileage: number;
    };
    cost: number;
    deposit: number;
    availability: string;
    image_url: string;
    description: string;
};