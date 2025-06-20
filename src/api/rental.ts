import { Rental, RentalRequest, PaymentRequest } from "../types";
import { axiosInstance } from "./instance";

export const createRental = async (rentalData: RentalRequest) => {
    const response = await axiosInstance.post<Rental>('/rentals', rentalData);
    return response.data;
};

export const createPayment = async (paymentData: PaymentRequest) => {
    const response = await axiosInstance.post('/payments', paymentData);
    return response.data;
};