import { useEffect, useMemo, useState } from "react";
import { fetchCars, type Car } from "../api/carsApi";
import { CarCard } from "./CarCards";

const normalize = (s: string) =>
  (s || "").toLowerCase().replace(/\s+/g, " ").trim();

type CarsInStockProps = {
  onReserve: (car: Car) => void;
};

export const CarsInStock = ({ onReserve }: CarsInStockProps) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [modelFilter, setModelFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    fetchCars()
      .then(setCars)
      .catch(() => setError("Ошибка загрузки автомобилей"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setVisibleCount(9);
  }, [modelFilter]);

  const models = useMemo(() => {
    const unique = new Set(cars.map((c) => normalize(c.model)));
    return Array.from(unique).filter(Boolean).sort();
  }, [cars]);

  const filtered = useMemo(() => {
    if (modelFilter === "all") return cars;
    return cars.filter((c) => normalize(c.model) === modelFilter);
  }, [cars, modelFilter]);

  if (loading) {
    return <div className="py-10 text-center text-gray-500">Загрузка автомобилей...</div>;
  }

  if (error) {
    return <div className="py-10 text-center text-red-500 font-semibold">{error}</div>;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white" id="stock">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-6">
          АВТОМОБИЛИ В НАЛИЧИИ
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Выберите автомобиль из наличия с лучшими условиями
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setModelFilter("all")}
            className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${
              modelFilter === "all"
                ? "bg-[#303c48] text-white border-[#303c48]"
                : "bg-white text-gray-700 border-gray-200 hover:border-[#f7761f] hover:text-[#f7761f]"
            }`}
          >
            Все
          </button>
          {models.map((m) => (
            <button
              key={m}
              onClick={() => setModelFilter(m)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition capitalize ${
                modelFilter === m
                  ? "bg-[#f7761f] text-white border-[#f7761f]"
                  : "bg-white text-gray-700 border-gray-200 hover:border-[#f7761f] hover:text-[#f7761f]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.slice(0, visibleCount).map((car) => (
            <CarCard key={car.id} car={car} onReserve={onReserve} />
          ))}
        </div>

        {visibleCount < filtered.length && (
          <div className="text-center mt-12">
            <button
              className="px-8 py-3 rounded-full text-sm font-semibold border border-[#f7761f] text-[#f7761f] bg-white hover:bg-[#f7761f] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
              onClick={() => setVisibleCount((prev) => prev + 9)}
            >
              Показать ещё ({filtered.length - visibleCount})
            </button>
          </div>
        )}

        {filtered.length === 0 && !loading && (
          <p className="text-center text-gray-500 mt-10">Нет автомобилей по выбранному фильтру</p>
        )}
      </div>
    </section>
  );
};
