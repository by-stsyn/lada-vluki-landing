import { useEffect, useState } from "react";

type Car = {
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

export const CarCard = ({
  car,
  onReserve,
}: {
  car: Car;
  onReserve?: (car: Car) => void;
}) => {
  const [index, setIndex] = useState(0);
  const hasPhotos = car.photos?.length > 0;

  useEffect(() => {
    setIndex(0);
  }, [car.id]);

  const next = () => {
    if (!hasPhotos) return;
    setIndex((prev) => (prev + 1) % car.photos.length);
  };

  const prev = () => {
    if (!hasPhotos) return;
    setIndex((prev) =>
      prev === 0 ? car.photos.length - 1 : prev - 1
    );
  };

  const finalPrice = Math.max(car.finalPrice, 0);

  return (
    <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition overflow-hidden border border-gray-100 flex flex-col h-full">
      
      <div className="relative h-[250px] bg-gray-100 overflow-hidden flex-shrink-0">
        <img
          src={car.photos?.[index] || "/no-image.jpg"}
          alt={`${car.brand} ${car.model}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        {hasPhotos && car.photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 text-white w-9 h-9 rounded-full hover:bg-black/60 flex items-center justify-center pb-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 text-white w-9 h-9 rounded-full hover:bg-black/60 flex items-center justify-center pb-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ›
            </button>
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-2 gap-2">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            {car.brand} {car.model}
          </h3>
          {/* ✅ ЦВЕТ ИЗМЕНЕН НА ОРАНЖЕВЫЙ */}
          <span className="flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-full bg-brand-orange text-white">
            В НАЛИЧИИ
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-4 flex-grow">
          {car.complectation || 'Не указана'}
        </p>

        <div className="mb-5">
          <div className="text-2xl font-bold text-[#303c48]">
            {finalPrice.toLocaleString('ru-RU')} ₽
          </div>
          {car.price > finalPrice && (
            <div className="text-sm text-gray-400 line-through">
              {car.price.toLocaleString('ru-RU')} ₽
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={() => window.location.href = `/car/${car.vin || car.id}`}
            className="w-full bg-brand-orange text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition shadow-md"
          >
            Подробнее
          </button>
          
          <button
           onClick={() => onReserve?.(car)}
            className="w-full bg-gray-100 text-[#303c48] py-3 rounded-xl font-semibold hover:bg-gray-200 transition shadow-sm"
          >
            Забронировать
          </button>
        </div>
      </div>
    </div>
  );
};
