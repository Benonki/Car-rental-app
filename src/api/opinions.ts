import { axiosInstance } from './instance';
import type { Opinion, CreateOpinionDto} from '../types';

export const postOpinion = (data: CreateOpinionDto): Promise<Opinion> => {
  return axiosInstance.post('/opinions', data).then(res => res.data);
};