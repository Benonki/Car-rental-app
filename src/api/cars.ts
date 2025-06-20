import { axiosInstance } from './instance';
import { Car, RawCar, Opinion } from '../types';
import { getOpinionsByCarId } from './opinions';

export const getCars = async (): Promise<Car[]> => {
  try {
    const response = await axiosInstance.get<RawCar[]>(`/cars`);
    const rawCars = response.data;

    const carImages: Record<string, { default: string }> = import.meta.glob('../assets/cars/*.png', {
      eager: true
    });

    const carsWithRatings: Car[] = await Promise.all(
      rawCars.map(async (item) => {
        const imagePath = `../assets/cars/${item.image_url}`;
        const imageUrl = carImages[imagePath]?.default || '';

        let rating = 0;
        try {
          const opinions: Opinion[] = await getOpinionsByCarId(item.id);
          if (opinions.length > 0) {
            const sum = opinions.reduce((acc, op) => acc + op.rating, 0);
            rating = sum / opinions.length;
          }
        } catch (e) {
          console.warn(`Nie udało się pobrać opinii dla auta ${item.id}, Error: ${e}`);
        }

        return {
          id: item.id,
          nazwa: item.model.name,
          kategoria: item.model.bodyType.name,
          cena: item.cost,
          image: imageUrl,
          ocena: rating,
          dostepny: item.availability.toLowerCase() === 'available',
          opis: item.description,
        };
      })
    );

    return carsWithRatings;
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
};

export const getCarById = async (id: string): Promise<Car> => {
    try {
        const response = await axiosInstance.get<RawCar>(`/cars/${id}`);
        const rawCar = response.data;

        const carImages: Record<string, { default: string }> = import.meta.glob('../assets/cars/*.png', {
            eager: true
        });

        const imagePath = `../assets/cars/${rawCar.image_url}`;
        const imageUrl = carImages[imagePath]?.default || '';

        let rating = 0;
        try {
            const opinions: Opinion[] = await getOpinionsByCarId(rawCar.id);
            if (opinions.length > 0) {
                const sum = opinions.reduce((acc, op) => acc + op.rating, 0);
                rating = sum / opinions.length;
            }
        } catch (e) {
            console.warn(`Failed to fetch opinions for car ${rawCar.id}, Error: ${e}`);
        }

        const carData: Car = {
            id: rawCar.id,
            nazwa: rawCar.model.name,
            kategoria: rawCar.model.bodyType.name,
            cena: rawCar.cost,
            image: imageUrl,
            ocena: rating,
            dostepny: rawCar.availability.toLowerCase() === 'available',
            opis: rawCar.description,
            specification: {
                yearOfProduction: rawCar.specification.yearOfProduction,
                registration: rawCar.specification.registration,
                vin: rawCar.specification.vin,
                color: rawCar.specification.color,
                numberOfSeats: rawCar.specification.numberOfSeats,
                engineCapacity: rawCar.specification.engineCapacity,
                horsepower: rawCar.specification.horsepower,
                gearbox: rawCar.specification.gearbox,
                driveType: rawCar.specification.driveType,
                fuelType: rawCar.specification.fuelType,
                mileage: rawCar.specification.mileage,
            }
        };

        return carData;
    } catch (error) {
        console.error('Error fetching car:', error);
        throw error;
    }
};