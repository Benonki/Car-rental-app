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
    paymentMethod?: 'STRIPE' | 'ON_SITE';
};

export interface AddressFormValues {
    name: string;
    country: string;
    postalCode: string;
    city: string;
    street: string;
    streetNumber: string;
}

export type RentalRequest = {
    customerId: string;
    carId: string;
    date_of_rental: string;
    date_of_return: string;
    pick_up_placeId: string;
    return_placeId: string;
    total_cost: number;
    status: string;
    paymentMethod?: 'ONLINE' | 'OFFLINE';
};

export type PaymentRequest = {
    rentalId: string;
    title: string;
    cost: number;
    paymentType: 'ONLINE' | 'OFFLINE';
};

export type InsuranceRange = 'NONE' | 'MINOR_DAMAGE' | 'FULL_COVERAGE';

export type InsuranceRequest = {
    rentalId: string;
    insurance_type: InsuranceType;
    cost: number;
    range_of_insurance: InsuranceRange;
};

export type Insurance = {
  id: string;
  rental: {
    id: string;
  };
  insurance_type: string;
  cost: number;
  range_of_insurance: InsuranceRange;
};

export interface ResultPageState {
    success: boolean;
    message: string;
    rentalStatus: 'Nadchodzące' | 'Zakończone' | 'Anulowane';
}