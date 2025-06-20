import dayjs from "dayjs";

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
    specification?: {
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

export type PickUpPlace = {
    id: string;
    name: string;
    address: Address;
};

export type ReturnPlace = {
    id: string;
    name: string;
    address: Address;
};

export type Address = {
    id: string;
    country: string;
    postal_code: string;
    city: string;
    street: string;
    street_number: string;
};

export type PersonalData = {
    id: string;
    address: Address;
    first_name: string;
    last_name: string;
    pesel: string;
    id_number: string;
    phone_number: string;
    email: string;
};

export type User = {
    id: string;
    name: string;
    email: string;
    provider: string;
    providerId: string;
    enabled: boolean;
};

export type Customer = {
    id: string;
    user: User;
    personalData: PersonalData;
    date_of_joining: string;
    loyalty_points: number;
};

export type Rental = {
  id: string;
  car: RawCar;
  date_of_rental: string;
  date_of_return: string;
  total_cost: number;
  status: string;
};

export type Opinion = {
  id: string;
  customer: Customer;
  car: RawCar;
  rating: number;
  description: string;
  date_of_publishing: string;
};

export type CreateOpinionDto = {
  customerId: string;
  carId: string;
  rating: number;
  description: string;
  date_of_publishing: string;
};

export type InsuranceType = 'NONE' | 'BASIC' | 'PREMIUM';

export type RentalFormValues = {
    dates: [dayjs.Dayjs, dayjs.Dayjs];
    pickUpPlaceId: string;
    returnPlaceId: string;
    insuranceType: InsuranceType;
};