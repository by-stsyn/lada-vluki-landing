import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import type { Car } from "../api/carsApi";

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

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasPhotos) return;
    setIndex((prev) => (prev + 1) % car.photos.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasPhotos) return;
    setIndex((prev) => (prev === 0 ? car.photos.length - 1 : prev - 1));
  };

  const openDetails = () => {
    const targetUrl = `/car/${car.vin || car.id}`;
    window.history.pushState({}, "", targetUrl);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const finalPrice = Math.max(car.finalPrice || car.price || 0, 0);
  const regularPrice = Math.max(car.price || 0, finalPrice);
  const benefit = regularPrice > finalPrice ? regularPrice - finalPrice : 0;
  // Ориентировочный платеж в кредит по госпрограмме (на 84 мес. с ПВ ~20%)
  const monthlyPayment = Math.max(Math.round((finalPrice * 0.72) / 72 / 100) * 100, 5900);

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200/90 flex flex-col h-full">
      {/* Фото автомобиля */}
      <div
        onClick={openDetails}
        className="relative h-60 sm:h-64 bg-[#f5f6f8] overflow-hidden flex-shrink-0 cursor-pointer"
      >
        <img
          src={car.photos?.[index] || "/promo-lada.webp"}
          alt={`${car.brand} ${car.model} ${car.complectation}`}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.endsWith("/promo-lada.webp")) {
              target.src = "/promo-lada.webp";
            }
          }}
          className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
        />

        {/* Верхние бейджи */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-10">
          <span className="inline-flex items-center gap-1.5 bg-[#26303a]/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            В наличии с ПТС
          </span>

          {benefit > 0 && (
            <span className="bg-[#ff6700] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm tabular-nums">
              Выгода {benefit.toLocaleString("ru-RU")} ₽
            </span>
          )}
        </div>

        {/* Стрелки переключения фото */}
        {hasPhotos && car.photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Предыдущее фото"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-[#26303a] w-8 h-8 rounded-full shadow-md flex items-center justify-center opacity-85 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Следующее фото"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-[#26303a] w-8 h-8 rounded-full shadow-md flex items-center justify-center opacity-85 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="absolute bottom-2.5 right-3 z-10 bg-black/55 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-0.5 rounded-md tabular-nums pointer-events-none">
              {index + 1} / {car.photos.length}
            </div>
          </>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Информация об автомобиле */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-3">
          <div className="flex items-baseline justify-between gap-2">
            <h3
              onClick={openDetails}
              className="text-xl font-extrabold text-[#26303a] hover:text-[#ff6700] transition cursor-pointer leading-tight"
            >
              {car.brand} {car.model}
            </h3>
            {car.vin && (
              <span className="text-[11px] font-mono text-gray-400 shrink-0">
                VIN …{car.vin.slice(-6)}
              </span>
            )}
          </div>

          <div className="mt-1.5 flex items-center gap-2">
            <span className="inline-block bg-[#f5f6f8] border border-gray-200/80 text-[#26303a] text-xs font-bold px-2.5 py-1 rounded-md">
              Комплектация: {car.complectation || "Стандарт"}
            </span>
          </div>
        </div>

        {/* Блок цены и кредита */}
        <div className="bg-[#f5f6f8] rounded-xl p-3.5 mb-4 border border-gray-200/70 mt-auto">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <div className="text-[11px] text-gray-500 font-medium">
                Цена по акции:
              </div>
              <div className="text-2xl font-extrabold text-[#26303a] tabular-nums leading-tight">
                {finalPrice.toLocaleString("ru-RU")} ₽
              </div>
            </div>
            {regularPrice > finalPrice && (
              <div className="text-right">
                <div className="text-[11px] text-gray-400">Без скидок:</div>
                <div className="text-xs font-semibold text-gray-400 line-through tabular-nums">
                  {regularPrice.toLocaleString("ru-RU")} ₽
                </div>
              </div>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-gray-200/80 flex items-center justify-between text-xs">
            <span className="text-gray-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6700] shrink-0" />
              В кредит:
            </span>
            <span className="font-extrabold text-[#ff6700] tabular-nums">
              от {monthlyPayment.toLocaleString("ru-RU")} ₽/мес.
            </span>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onReserve?.(car)}
            className="w-full bg-[#ff6700] hover:bg-[#e55c00] text-white py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition shadow-sm"
          >
            Забронировать
          </button>

          <button
            type="button"
            onClick={openDetails}
            className="w-full bg-[#26303a] hover:bg-[#182026] text-white py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition"
          >
            Подробнее
          </button>
        </div>
      </div>
    </div>
  );
};
