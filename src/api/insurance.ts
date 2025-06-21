import { InsuranceRequest } from "../types";
import { axiosInstance } from "./instance";

export const createInsurance = async (insuranceData: InsuranceRequest) => {
    const response = await axiosInstance.post('/insurances', insuranceData);
    return response.data;
};