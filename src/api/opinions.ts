import { axiosInstance } from './instance';
import type { Opinion, CreateOpinionDto} from '../types';

export const postOpinion = (data: CreateOpinionDto): Promise<Opinion> => {
  return axiosInstance.post('/opinions', data).then(res => res.data);
};

export const getOpinionsByCarId = (carId: string): Promise<Opinion[]> => {
  return axiosInstance.get(`/opinions/car/${carId}`).then(res => res.data);
};

export const getAllOpinions = (): Promise<Opinion[]> => {
  return axiosInstance.get('/opinions').then(res => res.data);
};