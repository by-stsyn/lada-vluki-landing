const CACHE_KEY = "lada_cars_cache_v5";
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

const normalizeLadaCars = (rawList: any[]): Car[] => {
  if (!Array.isArray(rawList)) return [];
  return rawList
    .filter((car: any) => {
      const b = String(car?.brand || "").toLowerCase();
      return b.includes("lada") || b.includes("ваз");
    })
    .map((car: any, idx: number) => ({
      id: String(car.id || car.vin || `lada-${idx}`),
      vin: car.vin ? String(car.vin) : undefined,
      brand: "LADA",
      model: String(car.model || ""),
      complectation: String(car.complectation || ""),
      photos: Array.isArray(car.photos) ? car.photos.filter(Boolean) : [],
      price: Number(car.price) || 0,
      oldPrice: Number(car.oldPrice) || 0,
      finalPrice: Number(car.finalPrice) || Number(car.price) || 0,
    }));
};

const fetchWithTimeout = async (url: string, timeoutMs: number): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const saveCache = (cars: Car[]) => {
  if (typeof window === "undefined" || cars.length === 0) return;
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data: cars,
        timestamp: Date.now(),
      })
    );
  } catch {
    // ignore quota errors
  }
};

export const fetchCars = async (): Promise<Car[]> => {
  try {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (
            parsed &&
            Array.isArray(parsed.data) &&
            parsed.data.length > 0 &&
            Date.now() - parsed.timestamp < CACHE_TTL
          ) {
            return parsed.data;
          }
        }
      } catch {
        localStorage.removeItem(CACHE_KEY);
      }
    }

    let data: any = null;

    // 1. На самом домене Reg.ru запрашиваем локальный /cars.php
    if (!import.meta.env.DEV) {
      try {
        const phpRes = await fetchWithTimeout("/cars.php", 6000);
        if (phpRes.ok) {
          const text = await phpRes.text();
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            data = parsed;
          }
        }
      } catch {
        // переход к резервному варианту
      }
    }

    // 2. В режиме разработки или превью запрашиваем напрямую с боевого домена на Reg.ru
    if (!data) {
      try {
        const res = await fetchWithTimeout("https://sales.lada-vluki.ru/cars.php", 6000);
        if (res.ok) {
          const parsed = await res.json();
          if (Array.isArray(parsed) && parsed.length > 0) {
            data = parsed;
          }
        }
      } catch {
        // переход к локальному снапшоту
      }
    }

    // 3. Мгновенный локальный резерв /cars-fallback.json
    if (!data) {
      const fallbackRes = await fetch("/cars-fallback.json");
      if (fallbackRes.ok) {
        data = await fallbackRes.json();
      }
    }

    const ladaCars = normalizeLadaCars(data);
    saveCache(ladaCars);
    return ladaCars;
  } catch (error) {
    console.error("Ошибка загрузки LADA:", error);
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed?.data)) return parsed.data;
        }
      } catch {
        // ignore
      }
    }
    return [];
  }
};

