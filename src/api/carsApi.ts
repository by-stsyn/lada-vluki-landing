const CACHE_KEY = "lada_cars_cache_v4";
const CACHE_TTL = 24 * 60 * 60 * 1000;

export type Car = {
  id: string;
  vin?: string;
  brand: string;
  model: string;
  complectation: string;
  photos: string[];
  price: number;
  oldPrice: number;
  finalPrice: number;
};

export const fetchCars = async (): Promise<Car[]> => {
  try {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL) {
          console.log("🚀 LADA: данные из кэша v4");
          return parsed.data;
        }
      }
    }

    const res = await fetch("https://carsinstok.onrender.com/api/cars");

    if (!res.ok) {
      throw new Error(`Ошибка сети: ${res.status}`);
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("Получены некорректные данные от сервера");
    }

    const allCars: Car[] = data.map((car: any) => ({
      id: car.id || '',
      vin: car.vin,
      brand: car.brand || '',
      model: car.model || '',
      complectation: car.complectation || "",
      photos: Array.isArray(car.photos) ? car.photos : [],
      price: Number(car.price) || 0,
      oldPrice: Number(car.oldPrice) || 0,
      finalPrice: Number(car.finalPrice) || 0,
    }));

    const ladaCars = allCars.filter(car => 
      car.brand.toLowerCase().includes('lada')
    );

    if (typeof window !== "undefined" && ladaCars.length > 0) {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: ladaCars,
          timestamp: Date.now(),
        })
      );
    }

    return ladaCars;
  } catch (error) {
    console.error("Ошибка загрузки LADA:", error);
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        return JSON.parse(cached).data;
      }
    }
    return []; 
  }
};
