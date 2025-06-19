import { axiosInstance } from './instance';
import { Car, RawCar } from '../types';

export const getCars = async (): Promise<Car[]> => {
    try {
        const response = await axiosInstance.get<RawCar[]>(`/cars`);
        const rawCars = response.data;
        console.log(response.data)
        const carImages: Record<string, { default: string }> = import.meta.glob('../assets/cars/*.png', {
            eager: true
        });

        return rawCars.map((item) => {
            const imagePath = `../assets/cars/${item.image_url}`;
            const imageUrl = carImages[imagePath]?.default || '';

            return {
                id: item.id,
                nazwa: item.model.name,
                kategoria: item.model.bodyType.name,
                cena: item.cost,
                image: imageUrl,
                ocena: 4,   //narazie na sztywno ocena
                dostepny: item.availability.toLowerCase() === 'available',
                opis: item.description,
            };
        });
    } catch (error) {
        console.error('Error fetching cars:', error);
        return [];
    }
};
